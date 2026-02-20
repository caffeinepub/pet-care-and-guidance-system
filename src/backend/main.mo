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
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Type definitions
  type PetId = Nat;
  public type PetType = { #dog; #cat; #bird; #other : Text };
  type Timestamp = Int;
  type AgeRange = { #puppyKitten; #adult; #senior };
  type VideoId = Nat;

  type Gender = {
    #male;
    #female;
    #other : Text;
  };

  type VaccinationFrequency = {
    #everyYear;
    #everyThreeYears;
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

  public type HealthContent = {
    title : Text;
    description : Text;
    category : Text;
    petType : PetType;
    videos : [YoutubeVideo];
  };

  // Persistent data stores
  let userProfiles = Map.empty<Principal, ?UserProfile>();
  let adminVideos = Map.empty<Nat, VideoLink>();
  let petCategories = Map.empty<Text, PetCategory>();
  let breeds = Map.empty<Text, Breed>();
  let healthContent = Map.empty<Text, HealthContent>();

  // Helper functions
  func isUserDisabled(user : Principal) : Bool {
    switch (userProfiles.get(user)) {
      case (null) { false }; // User not in system yet
      case (?null) { true }; // Explicitly disabled
      case (??_) { false }; // Active user with profile
    };
  };

  func ensureUserNotDisabled(caller : Principal) {
    if (isUserDisabled(caller)) {
      Runtime.trap("Unauthorized: User account is disabled");
    };
  };

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
      case (?null) { Runtime.trap("User account is disabled") };
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
    ensureUserNotDisabled(caller);
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    if (caller == user) {
      ensureUserNotDisabled(caller);
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
    ensureUserNotDisabled(caller);
    userProfiles.add(caller, ?profile);
  };

  public query ({ caller }) func getDashboardInfo() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard");
    };
    ensureUserNotDisabled(caller);
    switch (userProfiles.get(caller)) {
      case (null) { emptyProfile() };
      case (?null) { Runtime.trap("User account is disabled") };
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
    ensureUserNotDisabled(caller);
    findAndValidatePet(caller, petId);
  };

  public shared ({ caller }) func addPet(pet : Pet) : async PetId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add pets");
    };
    ensureUserNotDisabled(caller);
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
      case (?null) { Runtime.trap("User account is disabled") };
    };
    petId;
  };

  public shared ({ caller }) func updatePet(petId : PetId, updatedPet : Pet) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update pets");
    };
    ensureUserNotDisabled(caller);
    let _ = findAndValidatePet(caller, petId);
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        userProfiles.add(caller, ?{
          profile with
          pets = getUpdatedPets(profile.pets, petId, updatedPet);
        });
      };
      case (?null) { Runtime.trap("User account is disabled") };
    };
  };

  public shared ({ caller }) func removePet(petId : PetId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove pets");
    };
    ensureUserNotDisabled(caller);
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        let newPets = profile.pets.filter(func(p) { p.id != petId });
        userProfiles.add(caller, ?{
          profile with
          pets = newPets;
        });
      };
      case (?null) { Runtime.trap("User account is disabled") };
    };
  };

  // Vaccination management
  public shared ({ caller }) func addVaccination(petId : PetId, name : Text, dueDate : Timestamp, reminderFrequency : VaccinationFrequency) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add vaccinations");
    };
    ensureUserNotDisabled(caller);
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
      case (?null) { Runtime.trap("User account is disabled") };
    };
  };

  public shared ({ caller }) func markVaccinationCompleted(petId : PetId, vaccinationName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark vaccinations");
    };
    ensureUserNotDisabled(caller);
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
      case (?null) { Runtime.trap("User account is disabled") };
    };
  };

  // Favorites management
  public shared ({ caller }) func addFavorite(videoId : VideoId, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };
    ensureUserNotDisabled(caller);
    let favorite : Favorite = { videoId; name };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        userProfiles.add(caller, ?{
          profile with
          favorites = profile.favorites.concat([favorite]);
        });
      };
      case (?null) { Runtime.trap("User account is disabled") };
    };
  };

  public shared ({ caller }) func removeFavorite(videoId : VideoId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove favorites");
    };
    ensureUserNotDisabled(caller);
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) {
        let newFavorites = profile.favorites.filter(func(f) { f.videoId != videoId });
        userProfiles.add(caller, ?{
          profile with
          favorites = newFavorites;
        });
      };
      case (?null) { Runtime.trap("User account is disabled") };
    };
  };

  public query ({ caller }) func getAllFavoriteVideos() : async [Favorite] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view favorites");
    };
    ensureUserNotDisabled(caller);
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (??profile) { profile.favorites };
      case (?null) { Runtime.trap("User account is disabled") };
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

  public query ({ caller }) func getAllAdminVideoLinks() : async [VideoLink] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all videos");
    };
    adminVideos.values().toArray();
  };

  public query func getVideosByCategory(category : VideoCategory) : async [VideoLink] {
    // Public access - no authentication required for browsing videos
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
    ensureUserNotDisabled(caller);
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
      case (?null) { Runtime.trap("User account is disabled") };
    };
  };

  // Onboarding Bootstrap
  public shared ({ caller }) func submitOnboardingPet(pet : Pet) : async PetId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit onboarding pets");
    };
    ensureUserNotDisabled(caller);
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

  // Fetch functions for categories and breeds (public access for browsing)
  public query func getAllPetCategories() : async [PetCategory] {
    // Public access - no authentication required for browsing categories
    petCategories.values().toArray();
  };

  public query func getAllBreeds() : async [Breed] {
    // Public access - no authentication required for browsing breeds
    breeds.values().toArray();
  };

  public query func getBreedsByCategory(category : Text) : async [Breed] {
    // Public access - no authentication required for browsing breeds by category
    breeds.values().filter(func(b) { b.category == category }).toArray();
  };

  // Health & Care content management (admin only)
  public shared ({ caller }) func addHealthContent(content : HealthContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add health content");
    };
    healthContent.add(content.title, content);
  };

  public shared ({ caller }) func updateHealthContent(title : Text, updatedContent : HealthContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update health content");
    };
    switch (healthContent.get(title)) {
      case (null) { Runtime.trap("Health content not found") };
      case (?_) {
        healthContent.add(title, updatedContent);
      };
    };
  };

  public shared ({ caller }) func removeHealthContent(title : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove health content");
    };
    switch (healthContent.get(title)) {
      case (null) { Runtime.trap("Health content not found") };
      case (?_) {
        healthContent.remove(title);
      };
    };
  };

  public query func getAllHealthContent() : async [HealthContent] {
    // Public access - no authentication required for browsing health content
    healthContent.values().toArray();
  };

  public query func getHealthContentByCategory(category : Text) : async [HealthContent] {
    // Public access - no authentication required for browsing health content
    let content = healthContent.values().filter(
      func(h) { h.category == category }
    );
    content.toArray();
  };

  public query func getHealthContentByPetType(petType : PetType) : async [HealthContent] {
    // Public access - no authentication required for browsing health content
    let content = healthContent.values().filter(
      func(h) { h.petType == petType }
    );
    content.toArray();
  };

  // User account management (admin only)
  public shared ({ caller }) func disableUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can disable users");
    };
    userProfiles.add(user, null);
  };

  public shared ({ caller }) func enableUser(user : Principal, profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can enable users");
    };
    userProfiles.add(user, ?profile);
  };
};
