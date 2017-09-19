class TracksController < ApplicationController
  before_action :render_error, unless: :tracklist?

  def index
    render_tracks
  end

  def create
    @track = Track.new tracks_params
    @track.save ? render_tracks : render_error
  end

  private

  def track_params
    params.require(:track).permit(:source, :url)
  end

  def render_error
    render json: [], status: 400
  end

  def render_tracks
    render json: @tracklist.tracks
  end
end
