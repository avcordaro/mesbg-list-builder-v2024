export class OpenNavigationDrawerEvent extends Event {
  open: boolean;

  constructor(open: boolean) {
    super("mlb-event--open-nav-bar");
    this.open = open;
  }
}
