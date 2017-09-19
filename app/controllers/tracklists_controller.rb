class TracklistsController < ApplicationController
  before_action :create, unless: :tracklist?

  def show
  end

  private

  def create
    self.current_tracklist = Tracklist.create
    redirect_to slug: current_tracklist.slug
  end
end
