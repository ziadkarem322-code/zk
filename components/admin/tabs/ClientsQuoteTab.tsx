import type { Category } from "@/lib/types";
import { TextField, TextAreaField, ListEditor, Section } from "@/components/admin/fields";

interface Props {
  category: Category;
  onPatch: (set: Record<string, unknown>) => void;
}

export function ClientsQuoteTab({ category, onPatch }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <Section title="Clients (8)">
        <ListEditor label="Client names" values={category.clients} onCommitIndex={(i, v) => onPatch({ [`clients.${i}`]: v })} />
      </Section>

      <Section title="Testimonial">
        <TextAreaField label="Quote" value={category.quote} onCommit={(v) => onPatch({ quote: v })} />
        <TextField label="Attribution" value={category.quoteBy} onCommit={(v) => onPatch({ quoteBy: v })} />
      </Section>
    </div>
  );
}
