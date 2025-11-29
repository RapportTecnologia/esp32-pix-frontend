"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key, Trash2, Copy, Check, Ban, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { createApiKeyAction, deleteApiKeyAction, toggleApiKeyAction, listApiKeysAction } from "@/app/actions/auth";
import { toast } from "sonner";

interface ApiKeyData {
  id: string;
  name: string;
  keyPreview: string;
  isActive: boolean;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  user: {
    email: string;
    name: string | null;
  };
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadApiKeys() {
    setIsLoading(true);
    const result = await listApiKeysAction();
    if (result.success && result.apiKeys) {
      setApiKeys(result.apiKeys as ApiKeyData[]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadApiKeys();
  }, []);

  async function handleCreateApiKey(formData: FormData) {
    setIsCreating(true);
    const result = await createApiKeyAction(formData);
    if (result.success && result.key) {
      setNewKey(result.key);
      loadApiKeys();
    } else {
      toast.error(result.error || "Erro ao criar API Key");
    }
    setIsCreating(false);
  }

  async function handleDeleteApiKey(keyId: string, name: string) {
    if (!confirm(`Tem certeza que deseja excluir a API Key "${name}"?`)) {
      return;
    }
    
    const result = await deleteApiKeyAction(keyId);
    if (result.success) {
      toast.success("API Key excluída com sucesso!");
      loadApiKeys();
    } else {
      toast.error(result.error || "Erro ao excluir API Key");
    }
  }

  async function handleToggleApiKey(keyId: string) {
    const result = await toggleApiKeyAction(keyId);
    if (result.success) {
      toast.success("Status alterado com sucesso!");
      loadApiKeys();
    } else {
      toast.error(result.error || "Erro ao alterar status");
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Chave copiada para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDialogClose(open: boolean) {
    if (!open) {
      setNewKey(null);
    }
    setDialogOpen(open);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">API Keys</h1>
        
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Key className="w-4 h-4 mr-2" />
              Nova API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            {newKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>API Key Criada!</DialogTitle>
                  <DialogDescription>
                    Copie a chave abaixo. Ela não será exibida novamente.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="flex-1 text-sm break-all">{newKey}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(newKey)}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-yellow-600 dark:text-yellow-500">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Use esta chave no header <code className="bg-muted px-1 rounded">x-api-key</code> das requisições do firmware.
                    </span>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={() => handleDialogClose(false)}>
                    Fechar
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <form action={handleCreateApiKey}>
                <DialogHeader>
                  <DialogTitle>Criar Nova API Key</DialogTitle>
                  <DialogDescription>
                    Crie uma chave de API para usar no firmware ESP32
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Chave *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ex: ESP32 Loja Principal"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiresIn">Expiração</Label>
                    <select
                      id="expiresIn"
                      name="expiresIn"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      defaultValue="never"
                    >
                      <option value="never">Nunca expira</option>
                      <option value="30">30 dias</option>
                      <option value="90">90 dias</option>
                      <option value="180">180 dias</option>
                      <option value="365">1 ano</option>
                    </select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      "Criar API Key"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Chave</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último uso</TableHead>
              <TableHead>Expira em</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhuma API Key encontrada
                </TableCell>
              </TableRow>
            ) : (
              apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{key.name}</div>
                      <div className="text-xs text-muted-foreground">{key.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {key.keyPreview}
                    </code>
                  </TableCell>
                  <TableCell>
                    {key.isActive ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Ativa
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500">
                        <Ban className="w-4 h-4" />
                        Revogada
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {key.lastUsedAt
                      ? new Date(key.lastUsedAt).toLocaleDateString("pt-BR")
                      : "Nunca"}
                  </TableCell>
                  <TableCell>
                    {key.expiresAt
                      ? new Date(key.expiresAt).toLocaleDateString("pt-BR")
                      : "Nunca"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleApiKey(key.id)}
                        title={key.isActive ? "Revogar" : "Ativar"}
                      >
                        {key.isActive ? (
                          <Ban className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteApiKey(key.id, key.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
