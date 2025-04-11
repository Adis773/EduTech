import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// Kaspi Bank payment details
const KASPI_PHONE_NUMBER = "+77754529029";
const MONTHLY_PRICE = 7500;
const CURRENCY = "₸";

export function KaspiPaymentButton() {
  const [showDialog, setShowDialog] = useState(false);
  
  // Generate deep link for Kaspi transfer
  const generateKaspiLink = () => {
    // This is a placeholder URL structure for Kaspi transfers
    // Note: Actual Kaspi deep links may require specific formatting
    const kaspiLink = `kaspi://transfer?phone=${KASPI_PHONE_NUMBER}&amount=${MONTHLY_PRICE}&comment=EduTech_AI_Subscription`;
    return kaspiLink;
  };
  
  // Handle redirection to Kaspi app or website
  const handleRedirectToKaspi = () => {
    const kaspiLink = generateKaspiLink();
    
    // Try to open Kaspi app via deep link
    window.location.href = kaspiLink;
    
    // If deep link doesn't work, fallback URL could be opened
    // This is just a placeholder, might need to be updated with real fallback URL
    setTimeout(() => {
      window.open(`https://kaspi.kz/`, '_blank');
    }, 1000);
  };

  return (
    <>
      <Button 
        onClick={() => setShowDialog(true)}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        <CreditCard className="mr-2 h-4 w-4" /> 
        Оплатить через Kaspi
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Оплата через Kaspi Bank</DialogTitle>
            <DialogDescription>
              Переведите {MONTHLY_PRICE} {CURRENCY} на номер {KASPI_PHONE_NUMBER} для активации подписки EduTech AI.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            <QRCodeSVG 
              value={`kaspi://transfer?phone=${KASPI_PHONE_NUMBER}&amount=${MONTHLY_PRICE}`}
              size={200}
              level="H"
              bgColor="#FFFFFF"
              fgColor="#000000"
              includeMargin={true}
            />
            <p className="mt-4 text-sm text-neutral-500">
              Отсканируйте QR-код в приложении Kaspi или нажмите кнопку ниже
            </p>
          </div>
          
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <p className="text-sm font-medium">Сумма:</p>
              <p className="col-span-2 font-bold">{MONTHLY_PRICE} {CURRENCY}</p>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <p className="text-sm font-medium">Номер:</p>
              <p className="col-span-2">{KASPI_PHONE_NUMBER}</p>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <p className="text-sm font-medium">Период:</p>
              <p className="col-span-2">1 месяц</p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowDialog(false)}
              className="mb-2 sm:mb-0"
            >
              Отмена
            </Button>
            <Button 
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleRedirectToKaspi}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Перейти к оплате в Kaspi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}