import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ReturnPolicyPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20" dir="rtl"> {/* mt-20 for navbar offset, adjust as needed */}
        <h1 className="text-3xl font-bold mb-6 text-center">سياسة الإرجاع والاسترداد</h1>

        <div className="space-y-4 text-right">
          <section>
            <h2 className="text-2xl font-semibold mb-2">نافذة الإرجاع:</h2>
            <ul className="list-disc list-inside space-y-1 pr-5">
              <li>يمكن للعملاء طلب إرجاع المنتجات خلال 14 يومًا من تاريخ استلام الطلب.</li>
              <li>يجب أن تكون المنتجات المراد إرجاعها في حالتها الأصلية، جديدة وغير مفتوحة، وفي تغليفها الأصلي.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">عملية الإرجاع:</h2>
            <ul className="list-disc list-inside space-y-1 pr-5">
              <li>لطلب إرجاع منتج، يرجى التواصل معنا عبر صفحتنا على فيسبوك أو عبر تطبيق واتساب.</li>
              <li>يرجى تزويدنا برقم الطلب وسبب الإرجاع.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">طريقة استرداد المبلغ:</h2>
            <ul className="list-disc list-inside space-y-1 pr-5">
              <li>سيستلم العملاء المبلغ المسترد عبر خدمة إنستاباي أو المحفظة الإلكترونية الخاصة بهم.</li>
              <li><strong>وقت معالجة استرداد المبلغ:</strong> يتم استرداد المبلغ خلال يومين عمل من تاريخ استلام المنتج المرتجع في مخازننا ومراجعته والتأكد من مطابقته لشروط الإرجاع.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">تكاليف شحن الإرجاع:</h2>
            <p>يتحمل العميل تكاليف شحن الإرجاع.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">طريقة الإرجاع:</h2>
            <ul className="list-disc list-inside space-y-1 pr-5">
              <li>يمكن إرجاع المنتجات من خلال نفس شركة الشحن التي قامت بالتوصيل، حيث سيتم إنشاء بوليصة إرجاع من جانبنا.</li>
              <li>يمكن للعميل أيضًا إرسال المنتج المرتجع مع أي شركة شحن يفضلها على نفقته الخاصة.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">التعامل مع المنتجات التالفة أو المعيبة أو غير الصحيحة:</h2>
            <p>في حالة استلام منتج تالف أو به عيب مصنعي أو منتج غير صحيح، تتحمل شركتنا (التاجر) جميع تكاليف الإرجاع والشحن. سيتم استبدال المنتج أو رد قيمته بالكامل حسب رغبة العميل.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">الدول المطبق عليها السياسة:</h2>
            <p>هذه السياسة تنطبق على الطلبات داخل جمهورية مصر العربية.</p>
          </section>


        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReturnPolicyPage;