# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170917134433) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "tracklists", force: :cascade do |t|
    t.string   "slug"
    t.string   "uuid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_tracklists_on_slug", using: :btree
    t.index ["uuid"], name: "index_tracklists_on_uuid", using: :btree
  end

  create_table "tracks", force: :cascade do |t|
    t.integer  "tracklist_id"
    t.string   "api"
    t.string   "cover"
    t.string   "title"
    t.string   "meta"
    t.string   "identifier"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.index ["tracklist_id"], name: "index_tracks_on_tracklist_id", using: :btree
  end

  add_foreign_key "tracks", "tracklists"
end
