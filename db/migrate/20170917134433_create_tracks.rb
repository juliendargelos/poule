class CreateTracks < ActiveRecord::Migration[5.0]
  def change
    create_table :tracks do |t|
      t.references :tracklist, foreign_key: true
      t.integer :source
      t.string :url

      t.timestamps
    end
  end
end
