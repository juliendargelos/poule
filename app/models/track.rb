class Track < ApplicationRecord
  belongs_to :tracklist

  validates :api, presence: true
  validates :cover, presence: true
  validates :title, presence: true
  validates :meta, presence: true
  validates :identifier, presence: true
  validates :tracklist, presence: true

  default_scope -> { order created_at: :asc }
end
