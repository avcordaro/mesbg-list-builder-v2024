import { Paragraph } from "../components/Paragraph.tsx";
import { Section } from "../components/Section.tsx";

export const Roadmap = () => {
  return (
    <Section title="Roadmap">
      <Paragraph>
        Even though the app should already include everything you would need to
        build your army lists, there is always work to be done. Think of
        FAQ&apos;s and errata that need to be implemented or bugs on our side
        that need be be squashed. Aside from those few things we have our own
        list of things we still want to include.
      </Paragraph>

      <Paragraph>
        <strong>Internationalization;</strong> We are committed to support the
        many different MESBG communities all around the world. With
        accessibility being one of our top priorities, we would also like to
        make it linguistically available for everyone. Staring with Spanish as
        our first focus, we&apos;d like to open our gates for those willing to
        help translate the many rules and profiles.
      </Paragraph>

      <Paragraph>
        <strong>Sharing rosters;</strong> The MESBG List Builder providers
        multiple ways of exporting your roster and sharing it with the world.
        One way to share rosters is currently impossible: Sharing the a link to
        the actual roster. This will also allow other to import your roster into
        their own account and make edits for their own.
      </Paragraph>

      <Paragraph>
        <strong>Dynamic profile cards;</strong> The profile cards in the builder
        are currently a representation of what is in the books. The stat line is
        fixed, just as in the books, and does not represent your selected
        options. The defence does not update whenever you pick up a shield or
        armour. With the summarization of rules to keep them as a{" "}
        <i>quick reference</i> aside they pose a one to one representation of
        the books. We have had many request to create dynamic cards,{" "}
        <u>
          <i>
            this might also allow for uploading your own profile picture to it.
          </i>
        </u>
      </Paragraph>

      <Paragraph>
        <strong>Upgrading the gamemode;</strong> The gamemode part of the app
        has not seen many updates lately. With accounts now being a thing, and
        with that saving your gamestate remotely, we can look at connecting
        games between players. This allows you to see their rules and get
        informed about how much might, will and fate their heroes have left.
      </Paragraph>
    </Section>
  );
};
