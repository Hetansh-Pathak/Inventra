import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/layout/PageWrapper';
import GlassCard from '@/components/common/GlassCard';
import StatusBadge from '@/components/common/StatusBadge';
import { deliveries } from '@/mock/data';
import { ChevronLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const steps = ['Draft', 'Ready', 'Picked', 'Packed', 'Done'];
const statusToStep: Record<string, number> = { draft: 0, ready: 1, picked: 2, packed: 3, done: 4 };

export default function DeliveryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const delivery = deliveries.find(d => d._id === id);
  if (!delivery) return <PageWrapper><p className="text-muted-foreground text-center py-20">Delivery not found</p></PageWrapper>;

  const currentStep = statusToStep[delivery.status] ?? 0;

  return (
    <PageWrapper>
      <button onClick={() => navigate('/deliveries')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Deliveries
      </button>

      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-0 flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i <= currentStep ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs mt-1 text-muted-foreground">{s}</span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-0.5 mx-2" style={{ background: i < currentStep ? '#00D4AA' : 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-foreground mb-3">Delivery Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Delivery No:</span> <span className="font-mono text-primary ml-2">{delivery.deliveryNo}</span></div>
            <div><span className="text-muted-foreground">Customer:</span> <span className="text-foreground ml-2">{delivery.customerName}</span></div>
            <div><span className="text-muted-foreground">Date:</span> <span className="text-foreground ml-2">{delivery.deliveryDate}</span></div>
            <div><span className="text-muted-foreground">Created:</span> <span className="text-foreground ml-2">{delivery.createdAt}</span></div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-3">Actions</h3>
          <StatusBadge status={delivery.status} />
          <div className="mt-4 space-y-2">
            {delivery.status === 'draft' && <button onClick={() => toast.success('Marked as Ready')} className="btn-primary-gradient w-full text-sm">Mark Ready</button>}
            {delivery.status === 'ready' && <button onClick={() => toast.success('Items Picked')} className="btn-primary-gradient w-full text-sm">Mark as Picked</button>}
            {delivery.status === 'picked' && <button onClick={() => toast.success('Items Packed')} className="btn-primary-gradient w-full text-sm">Mark as Packed</button>}
            {delivery.status === 'packed' && <button onClick={() => toast.success('Delivery validated')} className="btn-primary-gradient w-full text-sm">Validate Delivery</button>}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Product</th>
              <th className="text-left p-4 text-xs uppercase text-muted-foreground font-medium">Location</th>
              <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Requested</th>
              <th className="text-right p-4 text-xs uppercase text-muted-foreground font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {delivery.lines.map(l => (
              <tr key={l._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="p-4 text-foreground">{l.productName}</td>
                <td className="p-4 text-muted-foreground">{l.locationName}</td>
                <td className="p-4 text-right text-foreground">{l.requestedQty} {l.unit}</td>
                <td className="p-4 text-right text-foreground">₹{(l.requestedQty * l.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </PageWrapper>
  );
}
