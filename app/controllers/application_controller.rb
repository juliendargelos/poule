class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  #TODO: remove except
  before_action :set_tracklist, except: :tmp

  #TODO: remove tmp action
  def tmp
    render html: '', layout: 'application'
  end

  protected

  def current_tracklist
    @current_tracklist ||= Tracklist.find_by uuid: session[:tracklist_uuid]
  end
  helper_method :current_tracklist

  def current_tracklist= v
    current_tracklist.destroy if current_tracklist?
    session[:tracklist_uuid] = v.uuid
    @current_tracklist = v
  end

  def current_tracklist? is: nil
    if !!current_tracklist
      is.present? ? current_tracklist.id == is.try(:id) : true
    else
      false
    end
  end

  def set_tracklist
    @tracklist = Tracklist.find_by slug: params[:tracklist_slug].present? ? params[:tracklist_slug] : params[:slug]
  end

  def tracklist?
    @tracklist.present?
  end
end
