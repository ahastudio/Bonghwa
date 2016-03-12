# App
class App < ActiveRecord::Base
  include FromJsonable

  validates :app_name, presence: true

  def self.first
    app = $redis.get("#{$servername}:app-data")
    if app.nil?
      app = super.to_json
      $redis.set("#{$servername}:app-data", app)
    end
    App.new(JSON.parse(app))
  end
end
