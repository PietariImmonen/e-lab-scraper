import CenteredLayout from "../../layout/centered/centered-layout";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <CenteredLayout>{children}</CenteredLayout>;
}
