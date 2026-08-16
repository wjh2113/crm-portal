import {
  IconBell,
  IconBook,
  IconDoc,
  IconFaq,
  IconHome,
  IconPlay,
  IconScale,
  IconStar,
  IconTool,
} from './Icons'

export const navIcons = {
  '/': IconHome,
  '/faq': IconFaq,
  '/sop': IconDoc,
  '/tools': IconTool,
  '/manuals': IconBook,
  '/recordings': IconPlay,
  '/rules': IconScale,
  '/notices': IconBell,
  '/service-star': IconStar,
} as const
