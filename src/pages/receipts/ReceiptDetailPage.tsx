import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { receipts } from '@/mock/data';
import { ChevronLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const steps = ['Draft', 'Confirmed', 'Validated', 'Done'];
const statusToStep: Record<string, number> = { draft: 0, confirmed: 1, validated: 2, done: 3 };

export default function ReceiptDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const receipt = receipts.find(r => r._id === id);

  if (!receipt) return <PageWrapper><p className="text-muted-foreground text-center py-20">Receipt not found</p></PageWrapper>;

  const currentStep = statusToStep[receipt.status] ?? 0;
  const totalQty = receipt.lines.reduce((s, l) => s + l.expectedQty, 0);
  const totalValue = receipt.lines.reduce((s, l) => s + l.expectedQty * l.unitPrice, 0);

  return (
    <PageWrapper>
      <button onClick={() => navigate('/receipts')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Receipts
      </button>

      {/* Progress */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-0 flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i <= currentStep ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'
                }`}>
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs mt-1 text-muted-foreground">{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2" style={{ background: i < currentStep ? '#00D4AA' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-foreground mb-3">Receipt Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Receipt No:</span> <span className="font-mono text-primary ml-2">{receipt.receiptNo}</span></div>
            <div><span className="text-muted-foreground">Supplier:</span> <span className="text-foreground ml-2">{receipt.supplierName}</span></div>
            <div><span className="text-muted-foreground">Expected:</span> <span className="text-foreground ml-2">{receipt.expectedDate}</span></div>
            <div><span className="text-muted-foreground">Created:</span> <span className="text-foreground ml-2">{receipt.createdAt}</span></div>
            {receipt.reference && <div><span className="text-muted-foreground">Reference:</span> <span className="text-foreground ml-2">{receipt.reference}</span></div>}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-3">Actions</h3>
          <StatusBadge status={receipt.status} />
          <div className="mt-4 space-y-2">
            {receipt.status === 'draft' && <button onClick={() => toast.success('Receipt confirmed')} className="btn-primary-gradient w-full text-sm">Confirm Receipt</button>}
            {receipt.status === 'confirmed' && <button onClick={() => toast.success('Receipt validated')} className="btn-primary-gradient w-full text-sm">Validate & Receive</button>}
            {receipt.status === 'validated' && <button onClick={() => toast.success('Marked as done')} className="btn-primary-gradient w-full text-sm">Mark Done</button>}
            {receipt.status !== 'done' && <button className="btn-danger w-full text-sm">Cancel</button>}
          </div>
        </GlassCard>
      </div>

      {/* Lines */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-semibold text-foreground">Product Lines</h3>
          <span className="text-xs text-muted-foreground">{receipt.lines.length} products · {totalQty} units · ₹{totalValue.toLocaleString()}</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Product</th>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Location</th>
              <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Expected</th>
              {receipt.status === 'validated' || receipt.status === 'done' ? <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Received</th> : null}
              <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {receipt.lines.map(l => (
              <tr key={l._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="p-4 text-foreground">{l.productName}</td>
                <td className="p-4 text-muted-foreground">{l.locationName}</td>
                <td className="p-4 text-right text-foreground">{l.expectedQty} {l.unit}</td>
                {(receipt.status === 'validated' || receipt.status === 'done') && <td className="p-4 text-right text-primary">{l.receivedQty ?? l.expectedQty}</td>}
                <td className="p-4 text-right text-foreground">₹{(l.expectedQty * l.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </PageWrapper>
  );
}
