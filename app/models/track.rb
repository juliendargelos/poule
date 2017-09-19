class Track < ApplicationRecord
  belongs_to :tracklist

  validates :source, presence: true
  validates :url, presence: true

  default_scope -> { order created_at: :desc }

  enum source: {
    youtube: 1
  }
end
