import { useAuth } from "@/hooks/use-auth";
import { useServers } from "@/hooks/use-servers";
import { ServerCard } from "@/components/server-card";
import { CreateServerDialog } from "@/components/create-server-dialog";
import { Button } from "@/components/ui/button";
import { LogOut, Server as ServerIcon, Clock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: servers, isLoading } = useServers();

  // Calculate if within allowed hours (18:00 - 22:00)
  const now = new Date();
  const currentHour = now.getHours();
  const isAllowedTime = currentHour >= 18 && currentHour < 22;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-white/5 bg-secondary/30 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <ServerIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              HostPanel
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Current Server Time: {format(now, "HH:mm")}</span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <img 
                src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-white/10"
              />
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-white">{user?.firstName} {user?.lastName}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => logout()} className="text-muted-foreground hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Alerts */}
        {!isAllowedTime && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert variant="destructive" className="bg-red-950/20 border-red-900/50 text-red-200">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Operation Restricted</AlertTitle>
              <AlertDescription>
                Server operations are only available between 18:00 and 22:00. You can view your servers but cannot start them at this time.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Your Instances</h2>
            <p className="text-muted-foreground">Manage and monitor your game servers.</p>
          </div>
          <CreateServerDialog />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers?.length === 0 ? (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-xl bg-white/5">
              <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ServerIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No servers found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                You haven't deployed any servers yet. Create your first Minecraft or Discord bot instance to get started.
              </p>
              <CreateServerDialog />
            </div>
          ) : (
            servers?.map((server, index) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ServerCard server={server} canStart={isAllowedTime} />
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
