// Applications close Friday March 23rd 11:59:59 PM EDT
const AppCloseDate = new Date(1521863999000);
const AppCloseDateString = AppCloseDate.toDateString();

/*
 * Throws an error if applications are closed. Returns nothing otherwise.
 */
export default function checkAppCloseDate() {
    if (Date.now() > AppCloseDate) throw new Meteor.Error("Applications closed on " + AppCloseDateString + ".");
}

/*
 * Returns a boolean of whether applications are still open or not.
 */
export function appsClosed() { return Date.now() > AppCloseDate; }
