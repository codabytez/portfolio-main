import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import IconStar from "@/components/ui/IconStar";
import AboutMenuIcon from "@/components/ui/AboutMenuIcon";
import Avatar from "@/components/ui/Avatar";
import DropdownItem from "@/components/ui/DropdownItem";
import FooterDesktop from "@/components/ui/FooterDesktop";
import GistSnippet from "@/components/ui/GistSnippet";
import FooterMobile from "@/components/ui/FooterMobile";
import HeaderDesktop from "@/components/ui/HeaderDesktop";
import HeaderMobile from "@/components/ui/HeaderMobile";
import ProjectCard from "@/components/ui/ProjectCard";
import SnakeGame from "@/components/ui/SnakeGame";
import Input from "@/components/ui/Input";
import MenuItem from "@/components/ui/MenuItem";
import Textarea from "@/components/ui/Textarea";
import DropdownLabel from "@/components/ui/DropdownLabel";
import DropdownTitle from "@/components/ui/DropdownTitle";
import SocialIcon from "@/components/ui/SocialIcon";
import TechIconBox from "@/components/ui/TechIconBox";
import TechnologyRow from "@/components/ui/TechnologyRow";

export default function Preview() {
  return (
    <div className="flex flex-1 flex-col items-start gap-10 p-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">Button</h2>
        <div className="flex gap-4">
          <Button variant="primary">button text</Button>
          <Button variant="default">button text</Button>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost">button text</Button>
          <Button variant="success">button text</Button>
        </div>
        <div className="flex gap-4">
          <Button variant="error">button text</Button>
          <Button variant="warning">button text</Button>
        </div>
        <div className="flex gap-4">
          <Button disabled>button text</Button>
        </div>
        <div className="flex gap-4">
          <Button variant="link">link button</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">IconStar</h2>
        <div className="flex gap-4">
          <IconStar type="solid" />
          <IconStar type="outline" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">Checkbox</h2>
        <div className="flex gap-4">
          <Checkbox defaultChecked />
          <Checkbox />
          <Checkbox autoFocus />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">SocialIcon</h2>
        <div className="flex gap-4">
          <SocialIcon type="x" state="static" />
          <SocialIcon type="x" state="hover" />
          <SocialIcon type="facebook" state="static" />
          <SocialIcon type="facebook" state="hover" />
          <SocialIcon type="linkedin" state="static" />
          <SocialIcon type="linkedin" state="hover" />
          <SocialIcon type="git" state="static" />
          <SocialIcon type="git" state="hover" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">TechIconBox</h2>
        <div className="flex gap-4">
          <TechIconBox type="react" />
          <TechIconBox type="html" />
          <TechIconBox type="vue" />
          <TechIconBox type="css" />
          <TechIconBox type="gatsby" />
          <TechIconBox type="angular" />
          <TechIconBox type="flutter" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">AboutMenuIcon</h2>
        <div className="flex gap-4">
          <AboutMenuIcon type="hobbies" state="static" />
          <AboutMenuIcon type="hobbies" state="selected" />
          <AboutMenuIcon type="personal info" state="static" />
          <AboutMenuIcon type="personal info" state="selected" />
          <AboutMenuIcon type="professional info" state="static" />
          <AboutMenuIcon type="professional info" state="selected" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">TechnologyRow</h2>
        <div className="flex flex-col gap-2">
          <TechnologyRow checked />
          <TechnologyRow autoFocus />
          <TechnologyRow />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">Avatar</h2>
        <div className="flex gap-4">
          <Avatar variant="1" />
          <Avatar variant="2" />
          <Avatar variant="3" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">DropdownTitle</h2>
        <div className="flex flex-col gap-2">
          <DropdownTitle state="closed" />
          <DropdownTitle state="opened" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">DropdownItem</h2>
        <div className="flex flex-col gap-2">
          <DropdownItem variant="space" />
          <DropdownItem variant="no space" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">DropdownLabel</h2>
        <div className="flex flex-col gap-2">
          <DropdownLabel open />
          <DropdownLabel open={false} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">Input</h2>
        <div className="flex max-w-93 flex-col gap-4">
          <Input state="static" />
          <Input state="focus" defaultValue="Standard input|" readOnly autoFocus />
          <Input state="error" defaultValue="Standard input|" readOnly />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">Textarea</h2>
        <div className="flex max-w-93 flex-col gap-4">
          <Textarea state="static" defaultValue="Standard input|" readOnly />
          <Textarea state="focus" defaultValue="Standard input|" readOnly autoFocus />
          <Textarea state="error" defaultValue="Standard input|" readOnly />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">MenuItem</h2>
        <div className="flex flex-wrap items-center gap-4">
          <MenuItem state="selected" />
          <MenuItem state="static" />
          <MenuItem state="hover" />
          <MenuItem state="icon" />
          <MenuItem state="icon hover" />
        </div>
      </section>

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">HeaderDesktop</h2>
        <HeaderDesktop />
      </section>

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">HeaderMobile</h2>
        <div className="flex max-w-93 flex-col gap-4">
          <HeaderMobile state="menu closed" />
          <HeaderMobile state="menu open" />
        </div>
      </section>

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">FooterDesktop</h2>
        <FooterDesktop />
      </section>

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">FooterMobile</h2>
        <div className="max-w-93">
          <FooterMobile />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">ProjectCard</h2>
        <div className="flex gap-4">
          <ProjectCard />
        </div>
      </section>

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">GistSnippet</h2>
        <div className="flex flex-col gap-6">
          <GistSnippet state="default" />
          <GistSnippet state="expanded" />
        </div>
      </section>

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-heading-h6 text-theme-heading-foreground">SnakeGame</h2>
        <div className="flex flex-wrap gap-4">
          <SnakeGame />
        </div>
      </section>
    </div>
  );
}
