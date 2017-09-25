Rails.application.routes.draw do
  get '/tmp' => 'application#tmp'

  get '/:slug/destroy' => 'tracklist#destroy', as: :destroy_tracklist
  get '/(:slug)' => 'tracklists#show', as: :tracklist

  get '/:tracklist_slug/tracks' => 'tracks#index', as: :tracks
  post '/:tracklist_slug/tracks' => 'tracks#create'
  delete '/:tracklist_slug/tracks' => 'tracks#destroy', as: :destroy_track
end
