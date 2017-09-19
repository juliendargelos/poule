class CreateTracklists < ActiveRecord::Migration[5.0]
  def change
    create_table :tracklists do |t|
      t.string :slug, unique: true, index: true
      t.string :uuid, unique: true, index: true

      t.timestamps
    end
  end
end
