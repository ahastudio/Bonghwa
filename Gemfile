source 'https://rubygems.org'

gem 'rails', '4.1.7'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'mysql2'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails'
  gem 'coffee-rails'
  gem 'uglifier'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer', :platforms => :ruby
end

gem 'jquery-rails'

# To use ActiveModel has_secure_password
gem 'bcrypt-ruby'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

gem 'protected_attributes'

gem 'redis-rails'

# Use unicorn as the app server
gem 'unicorn'

gem 'figaro'

# Deploy with Capistrano
group :deployment do
  gem 'capistrano', '~> 3.1'
  gem 'capistrano-rvm'
  gem 'capistrano-rails'
  gem 'capistrano-rails-console'
  gem 'capistrano-rails-collection'
  gem 'capistrano-rails-tail-log'
  gem 'capistrano_colors'
  gem 'capistrano-bundler'
  gem 'capistrano-ext'
  gem 'capistrano_rsync_with_remote_cache'
  gem 'capistrano-ssh-doctor', '~> 1.0'
end

# To test Project
group :development, :test do
  gem 'rspec-rails', '~> 3.0.0'
  gem 'rspec-collection_matchers'
  gem 'factory_girl_rails', "~> 4.0"
  gem 'capybara', '~> 2.4.0'
end

group :production do
  gem 'rb-readline'
end

# paging
gem 'will_paginate', '3.0.7'

# json
gem 'oj'

# To use debugger
# gem 'debugger'

# To provide file Upload
gem "paperclip", "~> 3.0"