class CreateTracks < ActiveRecord::Migration[5.0]
  def change
    create_table :tracks do |t|
      t.references :tracklist, foreign_key: true
      t.string :api
      t.string :cover
      t.string :title
      t.string :meta
      t.string :identifier

      t.timestamps
    end
  end
end
