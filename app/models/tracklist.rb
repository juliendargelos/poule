class Tracklist < ApplicationRecord
  include Slugable

  has_many :tracks, dependent: :destroy

  has_slug :slug
  has_slug :uuid, -> { SecureRandom.uuid }
end
