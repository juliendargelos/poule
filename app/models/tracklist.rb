class Tracklist < ApplicationRecord
  SLUG_CHARS = (0..9).to_a + ('a'..'z').to_a
  SLUG_LENGTH = 10

  after_initialize :set_uuid, :set_slug

  validates :uuid, presence: true, uniqueness: true
  validates :slug, presence: true, uniqueness: true

  protected

  def self.slug
    (0..SLUG_LENGTH - 1).map{ SLUG_CHARS.sample }.join
  end

  def set_slug
    self.slug = self.class.slug
  end

  def set_uuid
    self.uuid = SecureRandom.uuid
  end
end
