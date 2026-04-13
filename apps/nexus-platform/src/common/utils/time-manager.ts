export class TimeManager {
  // Returns current timestamp in milliseconds
  static now(): number {
    return new Date().getTime();//return curr time in milliseconds since epoch
  }

  // Returns a Date object that is X minutes in the future
  static fromNow(minutes: number): Date {
    const current = this.now();//curr time in ms
    const future = current + (minutes * 60 * 1000);//add minutes for future expiry time 
    return new Date(future);//return as future date so we can get the future time the token will expire in
  }
}