import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

// Actor definition
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Type definitions
  type PetId = Nat;
  type PetType = { #dog; #cat };
  type Timestamp = Int;
  type AgeRange = { #puppyKitten; #adult; #senior };
  type VaccinationFrequency = { #everyYear; #everyThreeYears };
  type VideoId = Nat;

  type Gender = {
    #male;
    #female;
    #other : Text;
  };

  type Vaccination = {
    name : Text;
    dueDate : Timestamp;
    reminderFrequency : VaccinationFrequency;
    completed : Bool;
  };

  type Pet = {
    id : PetId;
    name : Text;
    petType : PetType;
    breed : ?Text;
    age : Nat;
    weight : ?Nat;
    gender : Gender;
    lastVaccinatedDate : ?Timestamp;
    vaccinations : [Vaccination];
    photo : ?Storage.ExternalBlob;
  };

  type Favorite = {
    videoId : VideoId;
    name : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    pets : [Pet];
    favorites : [Favorite];
    profilePhoto : ?Storage.ExternalBlob;
  };

  type VideoCategory = {
    #petType : PetType;
    #breed : Text;
    #healthTopic : Text;
  };

  type VideoLink = {
    id : VideoId;
    title : Text;
    url : Text;
    category : VideoCategory;
    description : Text;
    uploadedBy : Principal;
  };

  type YoutubeVideo = {
    title : Text;
    url : Text;
  };

  type PetCategory = {
    name : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
    videos : [YoutubeVideo];
  };

  type Breed = {
    category : Text;
    name : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
    videos : [YoutubeVideo];
  };

  // Persistent data stores
  let userProfiles = Map.empty<Principal, ?UserProfile>();
  let adminVideos = Map.empty<Nat, VideoLink>();
  let petCategories = Map.empty<Text, PetCategory>();
  let breeds = Map.empty<Text, Breed>();

  // Helper functions
  func findAndValidatePet(caller : Principal, petId : PetId) : Pet {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        let foundPet = profile.pets.find(func(p) { p.id == petId });
        switch (foundPet) {
          case (null) { Runtime.trap("Pet not found") };
          case (?pet) { pet };
        };
      };
      case (?null) { Runtime.trap("Profile not found") };
    };
  };

  func getUpdatedPets(pets : [Pet], petId : PetId, updatedPet : Pet) : [Pet] {
    let index = pets.findIndex(func(p) { p.id == petId });
    switch (index) {
      case (null) { pets };
      case (?index) {
        pets.keys().map(
          func(i) {
            if (i == index) { updatedPet } else { pets[i] };
          }
        ).toArray();
      };
    };
  };

  func getPetName(user : Principal, petId : Nat) : ?Text {
    switch (userProfiles.get(user)) {
      case (??profile) {
        let foundPet = profile.pets.find(func(p) { p.id == petId });
        foundPet.map(func(p) { p.name });
      };
      case (null) { null };
      case (?null) { null };
    };
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, ?profile);
  };

  public query ({ caller }) func getDashboardInfo() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard");
    };
    switch (userProfiles.get(caller)) {
      case (null) { emptyProfile() };
      case (?null) { emptyProfile() };
      case (??profile) { profile };
    };
  };

  func emptyProfile() : UserProfile {
    {
      name = "";
      email = "";
      pets = [];
      favorites = [];
      profilePhoto = null;
    };
  };

  // Pet management
  public query ({ caller }) func getPet(petId : PetId) : async Pet {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view pets");
    };
    findAndValidatePet(caller, petId);
  };

  public shared ({ caller }) func addPet(pet : Pet) : async PetId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add pets");
    };
    let petId = Time.now().toNat();
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??up) {
        let newPet : Pet = {
          id = petId;
          name = pet.name;
          petType = pet.petType;
          breed = pet.breed;
          age = pet.age;
          weight = pet.weight;
          gender = pet.gender;
          lastVaccinatedDate = pet.lastVaccinatedDate;
          vaccinations = [];
          photo = pet.photo;
        };
        userProfiles.add(caller, ?{
          up with
          pets = up.pets.concat([newPet]);
        });
      };
      case (?null) { Runtime.trap("Profile not found") };
    };
    petId;
  };

  public shared ({ caller }) func updatePet(petId : PetId, updatedPet : Pet) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update pets");
    };
    let _ = findAndValidatePet(caller, petId);
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        userProfiles.add(caller, ?{
          profile with
          pets = getUpdatedPets(profile.pets, petId, updatedPet);
        });
      };
      case (?null) { Runtime.trap("Profile not found") };
    };
  };

  public shared ({ caller }) func removePet(petId : PetId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove pets");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        let newPets = profile.pets.filter(func(p) { p.id != petId });
        userProfiles.add(caller, ?{
          profile with
          pets = newPets;
        });
      };
      case (?null) { Runtime.trap("Profile not found") };
    };
  };

  // Vaccination management
  public shared ({ caller }) func addVaccination(petId : PetId, name : Text, dueDate : Timestamp, reminderFrequency : VaccinationFrequency) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add vaccinations");
    };
    let pet = findAndValidatePet(caller, petId);
    let vaccination : Vaccination = {
      name;
      dueDate;
      reminderFrequency;
      completed = false;
    };
    let updatedPet = {
      pet with
      vaccinations = pet.vaccinations.concat([vaccination]);
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        userProfiles.add(caller, ?{
          profile with
          pets = getUpdatedPets(profile.pets, petId, updatedPet);
        });
      };
      case (?null) { Runtime.trap("Profile not found") };
    };
  };

  public shared ({ caller }) func markVaccinationCompleted(petId : PetId, vaccinationName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark vaccinations");
    };
    let pet = findAndValidatePet(caller, petId);
    let updatedVaccinations = pet.vaccinations.map(
      func(vacc) {
        if (vacc.name == vaccinationName) {
          {
            vacc with
            completed = true;
          };
        } else {
          vacc;
        };
      }
    );
    let updatedPet = {
      pet with
      vaccinations = updatedVaccinations;
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        userProfiles.add(caller, ?{
          profile with
          pets = getUpdatedPets(profile.pets, petId, updatedPet);
        });
      };
      case (?null) { Runtime.trap("Profile not found") };
    };
  };

  // Favorites management
  public shared ({ caller }) func addFavorite(videoId : VideoId, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };
    let favorite : Favorite = { videoId; name };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        userProfiles.add(caller, ?{
          profile with
          favorites = profile.favorites.concat([favorite]);
        });
      };
      case (?null) { Runtime.trap("Profile not found") };
    };
  };

  public shared ({ caller }) func removeFavorite(videoId : VideoId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove favorites");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        let newFavorites = profile.favorites.filter(func(f) { f.videoId != videoId });
        userProfiles.add(caller, ?{
          profile with
          favorites = newFavorites;
        });
      };
      case (?null) { Runtime.trap("Profile not found") };
    };
  };

  public query ({ caller }) func getAllFavoriteVideos() : async [Favorite] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view favorites");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) { profile.favorites };
      case (?null) { Runtime.trap("Profile not found") };
    };
  };

  // Video management (admin only)
  public shared ({ caller }) func addAdminVideoLink(video : VideoLink) : async VideoId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add videos");
    };
    adminVideos.add(video.id, video);
    video.id;
  };

  public shared ({ caller }) func updateAdminVideoLink(videoId : VideoId, updatedVideo : VideoLink) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update videos");
    };
    switch (adminVideos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?_) {
        adminVideos.add(videoId, updatedVideo);
      };
    };
  };

  public shared ({ caller }) func removeAdminVideoLink(videoId : VideoId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove videos");
    };
    switch (adminVideos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?_) {
        adminVideos.remove(videoId);
      };
    };
  };

  public query ({ caller }) func getVideosByCategory(category : VideoCategory) : async [VideoLink] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view videos");
    };
    let videos = adminVideos.toArray().map(
      func((_, video)) { video }
    ).filter(
      func(video) { video.category == category }
    );
    videos;
  };

  // Fetch vaccination reminders
  public query ({ caller }) func getVaccinationReminders() : async [(Text, [Vaccination])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch vaccination reminders");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        let reminders = profile.pets.map(
          func(pet) {
            (pet.name, pet.vaccinations.filter(func(v) { not v.completed }));
          }
        );
        reminders;
      };
      case (?null) { Runtime.trap("Profile not found") };
    };
  };

  // Onboarding Bootstrap
  public shared ({ caller }) func submitOnboardingPet(pet : Pet) : async PetId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit onboarding pets");
    };
    await addPet(pet);
  };

  // Pet category management (admin only)
  public shared ({ caller }) func addPetCategory(category : PetCategory) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    petCategories.add(category.name, category);
  };

  public shared ({ caller }) func updatePetCategory(name : Text, updatedCategory : PetCategory) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    switch (petCategories.get(name)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        petCategories.add(name, updatedCategory);
      };
    };
  };

  public shared ({ caller }) func removePetCategory(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove categories");
    };
    switch (petCategories.get(name)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        petCategories.remove(name);
      };
    };
  };

  // Breed management (admin only)
  public shared ({ caller }) func addBreed(breed : Breed) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add breeds");
    };
    breeds.add(breed.name, breed);
  };

  public shared ({ caller }) func updateBreed(name : Text, updatedBreed : Breed) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update breeds");
    };
    switch (breeds.get(name)) {
      case (null) { Runtime.trap("Breed not found") };
      case (?_) {
        breeds.add(name, updatedBreed);
      };
    };
  };

  public shared ({ caller }) func removeBreed(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove breeds");
    };
    switch (breeds.get(name)) {
      case (null) { Runtime.trap("Breed not found") };
      case (?_) {
        breeds.remove(name);
      };
    };
  };

  // Fetch functions for categories and breeds
  public query ({ caller }) func getAllPetCategories() : async [PetCategory] {
    petCategories.values().toArray();
  };

  public query ({ caller }) func getAllBreeds() : async [Breed] {
    breeds.values().toArray();
  };

  public query ({ caller }) func getBreedsByCategory(category : Text) : async [Breed] {
    breeds.values().filter(func(b) { b.category == category }).toArray();
  };
};
