export interface ItemOption {
  icon: string;
  link: string;
  tooltip: string;
  visible: boolean;
  submenu?: ItemOption[];
}
