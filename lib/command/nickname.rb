# frozen_string_literal: true
module Command
  # Command::Nickname
  module Nickname
    module_function
    
    def run(params)
      script = params[:script]
      user = params[:user]
      new_nickname = script.args.first
      old_user_name = user.name

      return "이 명령어에는 하나의 인수가 필요합니다. '/닉 [변경할 닉네임]'라고 명령해주세요. \
               변경할 닉네임에는 공백 허용되지 않습니다." if script.args.size != 1
      return "변경하실 닉네임이 같습니다. 다른 닉네임으로 시도해 주세요." if new_nickname == user.name
      return "해당하는 닉네임은 이미 존재합니다." \
        if User.find_by_name(new_nickname) || new_nickname == "System"

      if user.update_nickname(new_nickname)
        "#{old_user_name}님의 닉네임이 #{user.name}로 변경되었습니다."
      else
        "닉네임을 #{new_nickname}로 변경할 수 없습니다."
      end
    end
  end
end