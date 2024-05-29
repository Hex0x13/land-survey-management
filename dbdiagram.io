Table Client {
  ID int [pk, increment]
  first_name text [not null, note: 'Length: 50']
  last_name text [not null, note: 'Length: 50']
  middle_name text [note: 'Length: 50']
  name_extension varchar [note: 'Length: 10']
  contact_number varchar [not null, note: 'Length: 16']
  email varchar [not null, unique, note: 'Length: 255']
}

Table Land_Parcel {
  ID int [pk, increment]
  Client_ID int [not null]
  Legal_Description varchar [not null, note: 'Length: 520']
  Street varchar [not null, note: 'Length: 100']
  Subdivision varchar [not null, note: 'Length: 150']
  City varchar [not null, note: 'Length: 100']
  Province varchar [not null, note: 'Length: 100']
  ZipCode varchar [not null, note: 'Length: 10']
  area varchar [not null, note: 'Length: 100']
}

Table Survey_project {
  ID int [pk, increment]
  Parcel_ID int [not null]
  Name varchar [not null, note: 'Length: 100']
  Description varchar [not null, note: 'Length: 1020']
  time_started datetime [not null]
  time_ended datetime
  service_type enum [not null, note: 'Values: "Relocation Survey", "Subdivision Survey", "Consolidation Survey", "Sketch Plan"']
  compensation decimal [not null, note: 'Precision: 15, Scale: 2']
}

Table Surveyor {
  ID int [pk, increment]
  first_name text [not null, note: 'Length: 50']
  last_name text [not null, note: 'Length: 50']
  middle_name text [note: 'Length: 50']
  name_extension varchar [note: 'Length: 10']
  title varchar [not null, note: 'Length: 50']
  contact_number varchar [not null, note: 'Length: 20']
  email varchar [not null, unique, note: 'Length: 255']
}

Table Survey_Project_Surveyor {
  Surveyor_ID int [not null]
  Survey_Project_ID int [not null]
  Indexes {
    (Surveyor_ID, Survey_Project_ID) [pk]
  }
}

Table Survey_Project_Image {
  ID int [pk, increment]
  Project_ID int [not null]
  Image_URL varchar [not null, note: 'Length: 255']
}

Table User {
  ID int [pk, increment]
  email varchar [not null, unique, note: 'Length: 255']
  password varchar [not null, note: 'Length: 255']
  surveyor_id int [not null]
}


Ref: Land_Parcel.Client_ID > Client.ID [delete: cascade]
Ref: Survey_project.Parcel_ID > Land_Parcel.ID [delete: cascade]
Ref: Survey_Project_Surveyor.Survey_Project_ID > Survey_project.ID [delete: cascade]
Ref: Survey_Project_Surveyor.Surveyor_ID > Surveyor.ID [delete: cascade]
Ref: Survey_Project_Image.Project_ID > Survey_project.ID [delete: cascade]
Ref: User.surveyor_id > Surveyor.ID [delete: cascade]