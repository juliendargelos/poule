class Track < ApplicationRecord
  belongs_to :tracklist

  enum source: {
    youtube: 1
  }

  validates :source, presence: true
  validates :url, presence: true
  validates :tracklist, presence: true

  default_scope -> { order created_at: :desc }
end
