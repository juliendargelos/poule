class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :set_tracklist

  protected

  def current_tracklist
    @current_tracklist ||= Tracklist.find_by uuid: session[:tracklist]
  end

  def current_tracklist= v
    current_tracklist.destroy if current_tracklist?
    session[:tracklist] = v.uuid
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
    @tracklist = Tracklist.find_by slug: params[:slug]
  end

  def tracklist?
    @tracklist.present?
  end
end
