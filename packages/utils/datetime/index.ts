class DateTimeHandler {
  private date: Date;

  constructor() {
    this.date = new Date();
  }

  public fromSeconds(seconds: number) {
    this.date = new Date(seconds * 1000);
    return this;
  }

  public fromJSDate(date: Date) {
    this.date = date;
    return this;
  }

  public fromISO(date: string) {
    this.date = new Date(date);
    return this;
  }

  public toRelative() {
    const seconds = Math.floor(
      (new Date().getTime() - this.date.getTime()) / 1000
    );
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  public toDateString() {
    return this.date.toLocaleString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  public toNiceFormat() {
    return this.date.toLocaleString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
}

export const DateTime = new DateTimeHandler();
