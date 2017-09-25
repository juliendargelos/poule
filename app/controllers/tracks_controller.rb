class TracksController < ApplicationController
  before_action :render_error, unless: :tracklist?
  before_action :set_track, only: :destroy

  def index
    render_tracks
  end

  def create
    @track = Track.new track_params.merge(tracklist: @tracklist)
    @track.save ? render_tracks : render_error
  end

  def destroy
    @track.try :destroy
    head :ok
  end

  private

  def set_track
    @track = Track.find_by tracklist: @tracklist, id: params.require(:track).permit(:id)[:id]
  end

  def track_params
    params.require(:track).permit(:api, :identifier, :cover, :title, :meta)
  end

  def render_error
    render json: [], status: 400
  end

  def render_tracks
    render json: @tracklist.tracks
  end
end
