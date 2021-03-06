# frozen_string_literal: true
# User
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable, :recoverable
  devise :database_authenticatable, :registerable,
         :rememberable, :trackable, :validatable
  validates :name, presence: true, uniqueness: true
  validates :login_id, presence: true, uniqueness: true

  has_many :firewoods

  before_create :default_recent_login

  def admin?
    level == 999
  end

  def unconfirmed?
    level.zero?
  end

  def lvup
    self.level = 1
  end

  def lvup!
    return unless unconfirmed?
    lvup
    save!
  end

  def update_nickname(new_name)
    old_user_name = name
    state = update(name: new_name)
    refresh_redis(old_user_name) if state
    state
  end

  def valid_password?(password)
    if legacy_password.present?
      validate_legacy_password(password)
    else
      super
    end
  end

  def validate_legacy_password(password)
    if BCrypt::Password.new(legacy_password) == password && self
      self.password = password
      self.legacy_password = nil
      save!
      true
    else
      false
    end
  end

  def reset_password!(*args)
    self.legacy_password = nil
    super
  end

  def email_required?
    false
  end

  def email_changed?
    false
  end

  private

  def default_recent_login
    self.recent_login = Time.zone.now
  end

  def refresh_redis(old_user_name)
    reload
    redis.zrem("active-users", old_user_name)
    redis.zadd("active-users", Time.zone.now.to_i, name)
    redis.set("session-#{id}", to_json)
    redis.expire("session-#{id}", 86_400)
  end

  def redis
    RedisWrapper
  end
end
