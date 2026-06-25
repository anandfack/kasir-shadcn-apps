"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/apiRequest";
import { Bot, Send, X, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Halo! Ada yang bisa saya bantu?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await apiRequest("POST", "/api/v1/admin/ai/chat", {
        messages: [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
      const aiReply = res.data?.message?.content || res.data?.response || JSON.stringify(res.data);
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Maaf, terjadi kesalahan. Coba lagi." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 md:w-96">
          <Card className="shadow-xl border-border">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">AI Assistant</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col gap-3 p-4 h-80 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2 max-w-[85%]",
                      msg.role === "user" ? "ml-auto" : ""
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="mt-1">
                        <Bot className="h-5 w-5 text-primary shrink-0" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="mt-1">
                        <User className="h-5 w-5 text-primary shrink-0" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2 max-w-[85%]">
                    <Bot className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div className="rounded-lg px-3 py-2 text-sm bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <form onSubmit={handleSend} className="flex w-full gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan..."
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
      <Button
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </Button>
    </>
  );
}
