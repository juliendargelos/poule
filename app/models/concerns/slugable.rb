module Slugable
  extend ActiveSupport::Concern

  SLUG_ATTRIBUTE = :slug
  SLUG_CHARS = (0..9).to_a + ('a'..'z').to_a
  SLUG_LENGTH = 10

  module ClassMethods

    def slugs
      @slugs ||= {}
    end

    protected

    def has_slug attribute = nil, method = nil, length: nil, chars: nil
      attribute = attribute.present? ? attribute.try(:to_s).try(:to_sym) : SLUG_ATTRIBUTE

      raise "Column \"#{attribute}\" doesn't exist in #{self}" unless attribute_names.include? attribute.to_s

      unless method.is_a? Proc
        length ||= SLUG_LENGTH
        chars ||= SLUG_CHARS
        chars = chars.to_s if chars.is_a? Symbol
        chars = chars.split if chars.is_a? String

        method = -> { (0..length - 1).map{ chars.sample }.join }
      end

      validates attribute, presence: true, uniqueness: true

      self.slugs[attribute] = method
    end
  end

  included do

    before_validation :set_slugs

    protected

    def set_slugs
      self.class.slugs.each { |attribute, _| set_slug attribute unless valid_slug? attribute }
    end

    def set_slug attribute = SLUG_ATTRIBUTE
      attribute = attribute.to_s.to_sym
      slug = self.class.slugs[attribute]
      send "#{attribute}=", nil

      if slug.is_a? Proc
        send "#{attribute}=", slug.call until valid_slug? attribute
        true
      else
        false
      end
    end

    def unique_slug? attribute = SLUG_ATTRIBUTE
      !(self.class.find_by(attribute => send(attribute)).try(:id) != id && id.present?)
    end

    def valid_slug? attribute = SLUG_ATTRIBUTE
      send(attribute).present? && unique_slug?(attribute)
    end
  end
end
