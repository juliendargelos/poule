require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Poule
  class Application < Rails::Application
    config.sass.preferred_syntax = :sass
    config.generators { |g| g.javascript_engine :js }
  end
end
