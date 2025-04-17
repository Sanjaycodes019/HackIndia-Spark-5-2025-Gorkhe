import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SafetyChatbot from "@/components/SafetyChatbot";

const DashboardPage = () => {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to SafeHer Dashboard</h1>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Safety Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <SafetyChatbot />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage; 