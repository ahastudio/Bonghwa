# frozen_string_literal: true
# ApiController
class ApiController < ApplicationController
  def create
    @fw = Firewood.create(
      user_id: @user.id,
      user_name: @user.name,
      prev_mt: params[:firewood][:prev_mt],
      contents: escape_tags(params[:firewood][:contents]),
      attached_file: params[:attach],
      adult_check: params[:adult_check],
      app: @app,
      user: @user
    )
    render json: JSON.dump("")
  end

  def destroy
    @fw = Firewood.find(params[:id])
    @fw.destroy if @fw.editable? @user

    render json: JSON.dump("")
  end

  # 지금 시점으로부터 가장 최근의 장작을 50개 불러온다.
  def now
    type = params[:type]
    @firewoods = case type
                 when "1" # Now
                   Firewood.trace(@user.id, 50)
                 when "2" # Mt
                   Firewood.mention(@user.id, @user.name, 50)
                 when "3" # Me
                   Firewood.me(@user.id, 50)
                 end.map(&:to_hash_for_api)

    update_login_info
    @users = recent_users

    render json: JSON.dump("fws" => @firewoods, "users" => @users)
  end

  # 지정한 멘션의 루트를 가지는 것을 최근 것부터 1개 긁어서 json으로 돌려준다.
  def get_mt
    @mts = Firewood.find_mt(params[:prev_mt], @user.id)
                   .map(&:to_hash_for_api)

    render json: JSON.dump("fws" => @mts)
  end

  # after 이후의 장작을 최대 1000개까지 내림차순으로 받아온다.
  def pulling
    type = params[:type]
    limit = 1000

    @firewoods = case type
                 when "1" # Now
                   Firewood.after(params[:after])
                           .trace(@user.id, limit)
                 when "2" # Mt
                   Firewood.after(params[:after])
                           .mention(@user.id, @user.name, limit)
                 when "3" # Me
                   Firewood.after(params[:after]).me(@user.id, limit)
                 end.map(&:to_hash_for_api)
    update_login_info
    @users = recent_users

    render json: JSON.dump("fws" => @firewoods, "users" => @users)
  end

  def trace
    limit = limit_count_to_50 params[:count].to_i # Limit maximum size
    type = params[:type]

    @firewoods = case type
                 when "1" # Now
                   Firewood.before(params[:before]).trace(@user.id, limit)
                 when "2" # Mt
                   Firewood.before(params[:before])
                           .mention(@user.id, @user.name, limit)
                 when "3" # Me
                   Firewood.before(params[:before])
                           .me(@user.id, limit)
                 end.map(&:to_hash_for_api)
    update_login_info

    render json: JSON.dump("fws" => @firewoods, "users" => @users)
  end

  private

  def limit_count_to_50(number)
    number > 50 ? 50 : number
  end

  def escape_tags(str)
    str.gsub("<", "&lt;").gsub(">", "&gt;")
  end

  def recent_users
    now_timestamp = Time.zone.now.to_i
    before_timestamp = now_timestamp - 40
    RedisWrapper.zrangebyscore("active-users", before_timestamp, now_timestamp)
                .sort.map { |user| { "name" => user } }
  end

  def update_login_info
    RedisWrapper.zadd("active-users", Time.zone.now.to_i, @user.name) \
      unless @user.id == 1
  end
end
