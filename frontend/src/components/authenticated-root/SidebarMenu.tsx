import { Location } from "react-router-dom";
import { NavigationItemWithIcon } from "../../routes/root";
import { DesktopSidebarMenu } from "./DesktopSidebarMenu";
import { MobileSidebarMenu } from "./MobileSidebarMenu";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  location: Location;
  navigation: NavigationItemWithIcon[];
}

export const SidebarMenu = ({ open, setOpen, location, navigation }: Props) => {
  return (
    <>
      <div className="md:hidden">
        <MobileSidebarMenu
          location={location}
          navigation={navigation}
          open={open}
          setOpen={setOpen}
        />
      </div>
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <DesktopSidebarMenu location={location} navigation={navigation} />
      </div>
    </>
  );
};
