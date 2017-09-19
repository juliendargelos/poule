Rails.application.routes.draw do
  get '/:slug/destroy' => 'tracklist#destroy', as: :destroy_tracklist
  get '/(:slug)' => 'tracklists#show', as: :tracklist

  get '/:tracklist_slug/tracks' => 'track#index', as: :tracks
  post '/:tracklist_slug/tracks' => 'track#create'
end
