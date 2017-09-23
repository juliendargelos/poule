module ApplicationHelper
  def svg name
    @svg ||= {}
    @svg[name.to_sym] ||= File.read(Rails.root + "app/assets/images/#{name}.svg").html_safe
  end

  def use id, *options
    <<-HTML.html_safe
      <svg #{svg(id).strip.split("\n").first[5..-2]} class="#{id}#{' '+options.join(' ') if options.any?}">
        <use xlink:href="#symbol-#{id}"></use>
      </svg>
    HTML
  end
end
