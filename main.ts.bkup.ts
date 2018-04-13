import { Meteor } from 'meteor/meteor';
import { Attendees } from './collections/attendees';
import { Statuses } from './collections/statuses';
import { Events } from './collections/events';
import { Attendee, AttendeeRole, Event, EventType, Status } from './models';

Meteor.startup(() => {
  // seed the server with data
  console.log("hello wtf length is %d", Attendees.find({}).cursor.count());
  Attendees.remove({});
  if(Attendees.find({}).cursor.count() === 0) {
    let evnt1 = Events.collection.insert(
              { id: 1, name: 'Programming Fundamentals',
                type: EventType.WORKSHOP_TECH_BGNR, location: 'QNC 1502',
                start: '1:30', end: '2:30',
                spots_tot: 60, spots_free: 60,
                tags: [ 'beginner-friendly', 'git', 'deals' ] });
    
    console.log(evnt1);
    let evnt2 = Events.collection.insert(
              { id: 2, name: 'Data Science',
                type: EventType.WORKSHOP_TECH_INTER, location: 'QNC 2506',
                start: '11:30', end: '12:30',
                spots_tot: 60, spots_free: 42,
                tags: [ 'beginner-friendly', 'data-science', 'python' ] });
    console.log(evnt2);
    let evnt3 = Events.collection.insert(
              { id: 3, name: 'Therapy Dogs',
                type: EventType.ACTIVITY, location: 'QNC 1501',
                start: '10:30', end: '12:00',
                spots_tot: 40, spots_free: 39,
                tags: [ 'dogs', 'destress', 'cute' ] });


    let evnt4 = Events.collection.insert(
              { id: 4, name: 'Lunch with Aunty\'s Kitchen',
                type: EventType.ACTIVITY, location: 'QNC 1501',
                start: '11:30', end: '1:00',
                spots_tot: 400, spots_free: 392,
                tags: [ 'food', 'lunch', 'desi', 'gluten-free', 'vegetarian', 'vegan', 'halal' ] });


    let sts1 = Statuses.collection.insert({ id: 1, action: 'organizing Equithon!', need_secondary: false, available_to: [ AttendeeRole.ORGANIZER ] });
    let sts2 = Statuses.collection.insert({ id: 2, action: 'helping out at ', need_secondary: true, available_to: [ AttendeeRole.ORGANIZER, AttendeeRole.MENTOR, AttendeeRole.SPONSOR, AttendeeRole.VOLUNTEER ] });
    let sts3 = Statuses.collection.insert({ id: 3, action: 'able to answer questions!', need_secondary: false, available_to: [ AttendeeRole.ORGANIZER, AttendeeRole.MENTOR, AttendeeRole.SPONSOR, AttendeeRole.VOLUNTEER ] });
    let sts4 = Statuses.collection.insert({ id: 4, action: 'working on my project!', need_secondary: false, available_to: [ AttendeeRole.HACKER ] });
    let sts5 = Statuses.collection.insert({ id: 5, action: 'just hanging out!', need_secondary: false, available_to: [ AttendeeRole.ORGANIZER, AttendeeRole.MENTOR, AttendeeRole.SPONSOR, AttendeeRole.VOLUNTEER, AttendeeRole.HACKER ] });
    

    console.log(sts1);
    console.log(sts2);
    console.log('inserting Attendees');
    Attendees.collection.insert(
      { name: 'Alex', email: 'alex@equithon.org', pass: 'alex', 
        profile_img: '../../assets/imgs/Attendee_profile_pics/alex.jpg', 
        role: AttendeeRole.ORGANIZER, status: { doing: sts1, secondary: null }, favs: [], 
        been_to: [], scan_info: { quick: false, amt: 3 } });
      
    Attendees.collection.insert(
      { name: 'Meagan', email: 'meagan@equithon.org', pass: 'meagan', 
        profile_img: '../../assets/imgs/Attendee_profile_pics/meagan.jpg', 
        role: AttendeeRole.ORGANIZER, status: { doing: sts2, secondary: this.evnt1 }, favs: [ evnt1, evnt4 ], 
        been_to: [ this.evnt1 ], scan_info: { quick: false, amt: 3 } });

    Attendees.collection.insert(
      { name: 'Hacker', email: 'hacker@equithon.org', pass: 'hacker', 
        profile_img: '../../assets/imgs/Attendee_profile_pics/hacker.jpg', 
        role: AttendeeRole.HACKER, status: { doing: sts4, secondary: null }, favs: [], 
        been_to: [ evnt2, evnt3 ], scan_info: { quick: false, amt: 3 } });

    Attendees.collection.insert(
      { name: 'Volunteer', email: 'volunteer@equithon.org', pass: 'volunteer', 
        role: AttendeeRole.VOLUNTEER, status: { doing: sts2, secondary: evnt4 }, favs: [ evnt1 ], 
        been_to: [ evnt4 ], scan_info: { quick: true, amt: 94 } });

    Attendees.collection.insert(
      { name: 'Mentor', email: 'mentor@equithon.org', pass: 'mentor', 
        role: AttendeeRole.MENTOR, status: { doing: sts3, secondary: null }, favs: [], 
        been_to: [], scan_info: { quick: false, amt: 3 } });

    Attendees.collection.insert(
      { name: 'Sponsor', email: 'sponsor@equithon.org', pass: 'sponsor', 
        role: AttendeeRole.SPONSOR, status: { doing: sts3, secondary: null }, favs: [], 
        been_to: [], scan_info: { quick: false, amt: 3 } });
  }
  console.log("WHOTHOEHTOIWEHTOWHETWT %d", Attendees.find({}).cursor.count());
  console.log(Attendees.find({}).fetch());
}
);
