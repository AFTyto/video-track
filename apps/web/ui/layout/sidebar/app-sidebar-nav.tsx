"use client";

import { getPlanCapabilities } from "@/lib/plan-capabilities";
import useWorkspace from "@/lib/swr/use-workspace";
import { type Icon, useRouterStuff } from "@dub/ui";
import {
  Bell,
  ConnectedDots,
  CubeSettings,
  Gear2,
  Globe,
  Key,
  LinesY as LinesYStatic,
  MarketingTarget,
  Receipt2,
  ShieldCheck,
  StackY3,
  Tag,
  Users6,
  Webhook,
} from "@dub/ui/icons";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { Compass } from "./icons/compass";
import { ConnectedDots4 } from "./icons/connected-dots4";
import { CursorRays } from "./icons/cursor-rays";
import { Hyperlink } from "./icons/hyperlink";
import { LinesY } from "./icons/lines-y";
import { SidebarNav, SidebarNavAreas, SidebarNavGroups } from "./sidebar-nav";
import { WorkspaceDropdown } from "./workspace-dropdown";

const usePartnerMessagesCount = () => ({ count: 0 });
const useFraudGroupCount = () => ({ fraudGroupCount: undefined });
const useProgramReferralsCount = () => ({ data: undefined });
const useProgramPayoutsCount = () => ({ data: undefined });
const usePartnerApplicationsCount = () => ({ data: undefined });

const pendingPayoutsCount = undefined;
const applicationsCount = undefined;
const program = undefined;

type SidebarNavData = {
  slug: string;
  pathname: string;
  queryString: string;
  defaultProgramId?: string;
  session?: Session | null;
  showNews?: boolean;
  pendingPayoutsCount?: number;
  applicationsCount?: number;
  submittedBountiesCount?: number;
  unreadMessagesCount?: number;
  pendingFraudEventsCount?: number;
  pendingReferralsCount?: number;
  showConversionGuides?: boolean;
  partnerNetworkEnabled?: boolean;
};

const NAV_GROUPS: SidebarNavGroups<SidebarNavData> = ({
  slug,
  pathname,
  defaultProgramId,
}) => {
  const programGroup = {
    id: "program",
    name: "Partner Program",
    description:
      "Kickstart viral product-led growth with powerful, branded referral and affiliate programs.",
    learnMoreHref: "https://dub.co/partners",
      icon: ConnectedDots4,
    href: slug ? `/${slug}/program` : "/program",
    active:
      !!slug &&
      pathname.startsWith(`/${slug}`) &&
      !pathname.startsWith(`/${slug}/links`) &&
      !pathname.startsWith(`/${slug}/settings`),
    popup: null as null,
  };
  const linksGroup = {
    id: "links",
    name: "Short Links",
    description:
      "Create, organize, and measure the performance of your short links.",
    learnMoreHref: "https://dub.co/links",
    icon: Compass,
    href: slug ? `/${slug}/links` : "/links",
    active: pathname.startsWith(`/${slug}/links`),
  };
  return defaultProgramId
    ? [programGroup, linksGroup]
    : [linksGroup, programGroup];
};

const NAV_AREAS: SidebarNavAreas<SidebarNavData> = {
  // partner program
  program: ({
    slug,
    showNews,
    pendingPayoutsCount,
    applicationsCount,
    submittedBountiesCount,
    unreadMessagesCount,
    pendingFraudEventsCount,
    pendingReferralsCount,
    partnerNetworkEnabled,
  }) => ({
    title: "VideoTrack",
    showNews,
    direction: "left",
    content: [
      {
        items: [
          {
            name: "Overview",
            icon: Gauge6,
            href: `/${slug}/program`,
            exact: true,
          },
          {
            name: "Payouts",
            icon: MoneyBills2,
            href: `/${slug}/program/payouts?status=pending`,
            badge: pendingPayoutsCount
              ? pendingPayoutsCount > 99
                ? "99+"
                : pendingPayoutsCount
              : undefined,
          },
          {
            name: "Messages",
            icon: Msgs,
            href: `/${slug}/program/messages`,
            badge: unreadMessagesCount
              ? unreadMessagesCount > 99
                ? "99+"
                : unreadMessagesCount
              : undefined,
          },
        ],
      },
      {
        name: "Partners",
        items: [
          {
            name: "All Partners",
            icon: Users,
            href: `/${slug}/program/partners`,
            isActive: (pathname: string, href: string) =>
              pathname.startsWith(href) &&
              !pathname.startsWith(`${href}/applications`),
          },
          {
            name: "Groups",
            icon: Users6,
            href: `/${slug}/program/groups`,
          },
          ...(partnerNetworkEnabled
            ? [
                {
                  name: "Partner Network",
                  icon: UserPlus,
                  href: `/${slug}/program/network` as `/${string}`,
                  badge: "New",
                },
              ]
            : []),
          {
            name: "Applications",
            icon: UserCheck,
            href: `/${slug}/program/partners/applications`,
            badge: applicationsCount
              ? applicationsCount > 99
                ? "99+"
                : applicationsCount
              : undefined,
          },
        ],
      },
      {
        name: "Insights",
        items: [
          {
            name: "Analytics",
            icon: LinesYStatic,
            href: `/${slug}/program/analytics`,
          },
          {
            name: "Customers",
            icon: User as Icon,
            href: `/${slug}/program/customers`,
            badge: pendingReferralsCount
              ? pendingReferralsCount > 99
                ? "99+"
                : pendingReferralsCount
              : undefined,
          },
          {
            name: "Commissions",
            icon: InvoiceDollar,
            href: `/${slug}/program/commissions`,
          },
          {
            name: "Fraud Detection",
            icon: ShieldKeyhole,
            href: `/${slug}/program/fraud`,
            badge: pendingFraudEventsCount
              ? pendingFraudEventsCount > 99
                ? "99+"
                : pendingFraudEventsCount
              : undefined,
          },
        ],
      },
      {
        name: "Engagement",
        items: [
          {
            name: "Bounties",
            icon: Trophy,
            href: `/${slug}/program/bounties`,
            badge: submittedBountiesCount
              ? submittedBountiesCount > 99
                ? "99+"
                : submittedBountiesCount
              : "",
          },
          {
            name: "Email Campaigns",
            icon: PaperPlane,
            href: `/${slug}/program/campaigns` as `/${string}`,
          },
          {
            name: "Resources",
            icon: LifeRing,
            href: `/${slug}/program/resources`,
          },
        ],
      },
      {
        name: "Configuration",
        items: [
          {
            name: "Rewards",
            icon: Gift,
            href: `/${slug}/program/groups/default/rewards`,
            arrow: true,
            isActive: () => false,
          },
          {
            name: "Links",
            icon: Sliders,
            href: `/${slug}/program/groups/default/links`,
            arrow: true,
            isActive: () => false,
          },
          {
            name: "Branding",
            icon: Brush,
            arrow: true,
            href: `/${slug}/program/groups/default/branding`,
            isActive: () => false,
          },
        ],
      },
    ],
  }),
  // short links
  links: ({ slug, pathname, queryString }) => ({
    title: "Video Links",
    showNews: false,
    direction: "left",
    content: [
      {
        items: [
          {
            name: "Links",
            icon: Hyperlink,
            href: `/${slug}/links${pathname === `/${slug}/links` ? "" : queryString}`,
            isActive: (pathname: string, href: string) => {
              const basePath = href.split("?")[0];
              if (pathname === basePath) return true;
              if (pathname.startsWith(basePath + "/")) {
                const nextSegment = pathname.slice(basePath.length + 1).split("/")[0];
                return nextSegment.includes(".");
              }
              return false;
            },
          },
          {
            name: "Analytics",
            icon: LinesY,
            href: `/${slug}/analytics${pathname === `/${slug}/analytics` ? "" : queryString}`,
          },
          {
            name: "Events",
            icon: CursorRays,
            href: `/${slug}/events${pathname === `/${slug}/events` ? "" : queryString}`,
          },
          {
            name: "Tags",
            icon: Tag,
            href: `/${slug}/links/tags`,
          },
        ],
      },
    ],
  }),

  // Workspace settings
  workspaceSettings: ({ slug }) => ({
    title: "Settings",
    backHref: `/${slug}`,
    content: [
      {
        name: "Workspace",
        items: [
          {
            name: "General",
            icon: Gear2,
            href: `/${slug}/settings`,
            exact: true,
          },
          {
            name: "Billing",
            icon: Receipt2,
            href: `/${slug}/settings/billing`,
          },
          {
            name: "Domains",
            icon: Globe,
            href: `/${slug}/settings/domains`,
          },
          {
            name: "Members",
            icon: Users6,
            href: `/${slug}/settings/members`,
          },
          {
            name: "Integrations",
            icon: ConnectedDots,
            href: `/${slug}/settings/integrations`,
          },
          {
            name: "Security",
            icon: ShieldCheck,
            href: `/${slug}/settings/security`,
          },
        ],
      },
      {
        name: "Developer",
        items: [
          {
            name: "API Keys",
            icon: Key,
            href: `/${slug}/settings/tokens`,
          },
          {
            name: "Logs",
            icon: StackY3,
            href: `/${slug}/settings/logs`,
          },
          {
            name: "Tracking",
            icon: MarketingTarget,
            href: `/${slug}/settings/tracking`,
          },
          {
            name: "Webhooks",
            icon: Webhook,
            href: `/${slug}/settings/webhooks`,
          },
          {
            name: "OAuth Apps",
            icon: CubeSettings,
            href: `/${slug}/settings/oauth-apps`,
          },
        ],
      },
      {
        name: "Account",
        items: [
          {
            name: "Notifications",
            icon: Bell,
            href: `/${slug}/settings/notifications`,
          },
        ],
      },
    ],
  }),

  // User settings
  userSettings: ({ slug }) => ({
    title: "Settings",
    backHref: `/${slug}`,
    hideSwitcherIcons: true,
    content: [
      {
        name: "Account",
        items: [
          {
            name: "General",
            icon: Gear2,
            href: "/account/settings",
            exact: true,
          },
          {
            name: "Security",
            icon: ShieldCheck,
            href: "/account/settings/security",
          },
          {
            name: "Referrals",
            icon: Gift,
            href: "/account/settings/referrals",
          },
          {
            name: "Notifications",
            icon: Bell,
            href: "/settings/notifications",
            arrow: true,
          },
        ],
      },
    ],
  }),
};

export function AppSidebarNav({
  toolContent,
  newsContent,
}: {
  toolContent?: ReactNode;
  newsContent?: ReactNode;
}) {
  const { slug } = useParams() as { slug?: string };
  const pathname = usePathname();
  const { getQueryString } = useRouterStuff();
  const { data: session } = useSession();
  const { plan, defaultProgramId, trialEndsAt } = useWorkspace();

  const currentArea = useMemo(() => {
    return pathname.startsWith("/account/settings")
      ? "userSettings"
      : pathname.startsWith(`/${slug}/settings`)
        ? "workspaceSettings"
        : "links";
  }, [slug, pathname]);

  const submittedBountiesCount = 0;

  const { count: unreadMessagesCount } = usePartnerMessagesCount({
    enabled: Boolean(currentArea === "program"),
    query: {
      unread: true,
    },
  });

  const { fraudGroupCount: pendingFraudEventsCount } = useFraudGroupCount<
    number | undefined
  >({
    query: { status: "pending" },
    enabled: Boolean(currentArea === "program" && defaultProgramId),
    ignoreParams: true,
  });

  const { data: pendingReferralsCount } = useProgramReferralsCount<number>({
    query: { status: "pending" },
    ignoreParams: true,
    enabled: Boolean(
      currentArea === "program" &&
        defaultProgramId &&
        REFERRAL_ENABLED_PROGRAM_IDS.includes(defaultProgramId),
    ),
  });

  const { canTrackConversions } = getPlanCapabilities(plan);

  return (
    <SidebarNav
      groups={NAV_GROUPS}
      areas={NAV_AREAS}
      currentArea={currentArea}
      data={{
        slug: slug || "",
        pathname,
        queryString: getQueryString(undefined, {
          include: ["folderId"],
        }),
        session: session || undefined,
        showNews: true,
        defaultProgramId: defaultProgramId || undefined,
        pendingPayoutsCount: pendingPayoutsCount?.[0]?.count ?? 0,
        applicationsCount,
        submittedBountiesCount,
        unreadMessagesCount,
        pendingFraudEventsCount,
        pendingReferralsCount,
        showConversionGuides:
          canTrackConversions && pathname.startsWith(`/${slug}/links`),
        partnerNetworkEnabled:
          program && program.partnerNetworkEnabledAt !== null,
      }}
      toolContent={toolContent}
      newsContent={
        plan &&
        (plan === "free" || isWorkspaceBillingTrialActive(trialEndsAt) ? (
          <SidebarUsage />
        ) : (
          newsContent
        ))
      }
      switcher={<WorkspaceDropdown />}
    />
  );
}
