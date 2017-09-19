class Tracklist < ApplicationRecord
  include Slugable

  has_slug :slug
  has_slug :uuid, -> { SecureRandom.uuid }
end
