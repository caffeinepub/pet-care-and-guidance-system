import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Storage "blob-storage/Storage";

module {
  type OldPetId = Nat;
  type OldPetType = { #dog; #cat };
  type OldTimestamp = Int;
  type OldAgeRange = { #puppyKitten; #adult; #senior };
  type OldVaccinationFrequency = { #everyYear; #everyThreeYears };
  type OldVideoId = Nat;

  type OldGender = {
    #male;
    #female;
    #other : Text;
  };

  type OldVaccination = {
    name : Text;
    dueDate : OldTimestamp;
    reminderFrequency : OldVaccinationFrequency;
    completed : Bool;
  };

  type OldPet = {
    id : OldPetId;
    name : Text;
    petType : OldPetType;
    breed : ?Text;
    age : Nat;
    weight : ?Nat;
    gender : OldGender;
    lastVaccinatedDate : ?OldTimestamp;
    vaccinations : [OldVaccination];
    photo : ?Storage.ExternalBlob;
  };

  type OldFavorite = {
    videoId : OldVideoId;
    name : Text;
  };

  type OldUserProfile = {
    name : Text;
    email : Text;
    pets : [OldPet];
    favorites : [OldFavorite];
    profilePhoto : ?Storage.ExternalBlob;
  };

  type OldVideoCategory = {
    #petType : OldPetType;
    #breed : Text;
    #healthTopic : Text;
  };

  type OldVideoLink = {
    id : OldVideoId;
    title : Text;
    url : Text;
    category : OldVideoCategory;
    description : Text;
    uploadedBy : Principal;
  };

  type OldYoutubeVideo = {
    title : Text;
    url : Text;
  };

  type OldPetCategory = {
    name : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
    videos : [OldYoutubeVideo];
  };

  type OldBreed = {
    category : Text;
    name : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
    videos : [OldYoutubeVideo];
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, ?OldUserProfile>;
    adminVideos : Map.Map<Nat, OldVideoLink>;
    petCategories : Map.Map<Text, OldPetCategory>;
    breeds : Map.Map<Text, OldBreed>;
  };

  type NewPetId = Nat;
  type NewPetType = { #dog; #cat; #bird; #other : Text };
  type NewTimestamp = Int;
  type NewAgeRange = { #puppyKitten; #adult; #senior };
  type NewVaccinationFrequency = { #everyYear; #everyThreeYears };
  type NewVideoId = Nat;

  type NewGender = {
    #male;
    #female;
    #other : Text;
  };

  type NewVaccination = {
    name : Text;
    dueDate : NewTimestamp;
    reminderFrequency : NewVaccinationFrequency;
    completed : Bool;
  };

  type NewPet = {
    id : NewPetId;
    name : Text;
    petType : NewPetType;
    breed : ?Text;
    age : Nat;
    weight : ?Nat;
    gender : NewGender;
    lastVaccinatedDate : ?NewTimestamp;
    vaccinations : [NewVaccination];
    photo : ?Storage.ExternalBlob;
  };

  type NewFavorite = {
    videoId : NewVideoId;
    name : Text;
  };

  type NewUserProfile = {
    name : Text;
    email : Text;
    pets : [NewPet];
    favorites : [NewFavorite];
    profilePhoto : ?Storage.ExternalBlob;
  };

  type NewVideoCategory = {
    #petType : NewPetType;
    #breed : Text;
    #healthTopic : Text;
  };

  type NewVideoLink = {
    id : NewVideoId;
    title : Text;
    url : Text;
    category : NewVideoCategory;
    description : Text;
    uploadedBy : Principal;
  };

  type NewYoutubeVideo = {
    title : Text;
    url : Text;
  };

  type NewPetCategory = {
    name : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
    videos : [NewYoutubeVideo];
  };

  type NewBreed = {
    category : Text;
    name : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
    videos : [NewYoutubeVideo];
  };

  type NewHealthContent = {
    title : Text;
    description : Text;
    category : Text;
    petType : NewPetType;
    videos : [NewYoutubeVideo];
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, ?NewUserProfile>;
    adminVideos : Map.Map<Nat, NewVideoLink>;
    petCategories : Map.Map<Text, NewPetCategory>;
    breeds : Map.Map<Text, NewBreed>;
    healthContent : Map.Map<Text, NewHealthContent>;
  };

  func convertPetType(oldPetType : OldPetType) : NewPetType {
    switch (oldPetType) {
      case (#dog) { #dog };
      case (#cat) { #cat };
    };
  };

  func convertPets(oldPets : [OldPet]) : [NewPet] {
    oldPets.map<OldPet, NewPet>(
      func(oldPet) {
        { oldPet with petType = convertPetType(oldPet.petType) };
      }
    );
  };

  func convertUserProfile(oldUserProfile : OldUserProfile) : NewUserProfile {
    { oldUserProfile with pets = convertPets(oldUserProfile.pets) };
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles.map<Principal, ?OldUserProfile, ?NewUserProfile>(
        func(_p, oldProfile) {
          switch (oldProfile) {
            case (null) { null };
            case (?profile) {
              let newProfile = convertUserProfile(profile);
              ?newProfile;
            };
          };
        }
      );
      adminVideos = old.adminVideos.map<Nat, OldVideoLink, NewVideoLink>(
        func(_id, oldLink) {
          { oldLink with category = switch (oldLink.category) {
            case (#petType(pt)) { #petType(convertPetType(pt)) };
            case (#breed(_)) {
              oldLink.category : NewVideoCategory;
            };
            case (#healthTopic(_)) {
              oldLink.category : NewVideoCategory;
            };
          } };
        }
      );
      petCategories = old.petCategories.map<Text, OldPetCategory, NewPetCategory>(
        func(_name, category) { category },
      );
      breeds = old.breeds.map<Text, OldBreed, NewBreed>(
        func(_name, breed) { breed },
      );
      healthContent = Map.empty<Text, NewHealthContent>();
    };
  };
};
