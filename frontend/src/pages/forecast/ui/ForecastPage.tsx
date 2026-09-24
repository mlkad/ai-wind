import { useTranslation } from "react-i18next";
import { getLanguage, type Language } from "@/shared/i18n";
import { useEffect, useRef } from "react";

import { toForecastRequest, useRunForecast } from "@/entities/forecast";
import { Card, Reveal } from "@/shared/ui";
import { AgentActivity } from "@/widgets/agent-activity";
import { AiExplanation } from "@/widgets/ai-explanation";
import { BrandCard } from "@/widgets/brand-card";
import { PowerForecastChart } from "@/widgets/forecast-chart";
import { ForecastControls } from "@/widgets/forecast-controls";
import { Header } from "@/widgets/header";
import { ModelMetrics } from "@/widgets/metrics-panel";
import { ForecastSummary } from "@/widgets/turbine-summary";
import { WeatherPanel } from "@/widgets/weather-panel";

import { useForecastParams } from "../model/useForecastParams";

export function ForecastPage() {
  useTranslation();
  const language = getLanguage();
  const { params, updateParams } = useForecastParams();
  const runForecast = useRunForecast();

  const hasCurrentLanguage = runForecast.variables?.language === language;
  const forecast = hasCurrentLanguage ? runForecast.data : undefined;
  const isRunning = !hasCurrentLanguage || runForecast.isPending;
  const handleRun = () => runForecast.mutate({ ...toForecastRequest(params), language });

  // A language change reruns the last submitted parameters, not unsubmitted control edits.
  // Mutation observers only expose the latest run, so late responses cannot restore old text.
  const lastLanguage = useRef<Language | null>(null);
  useEffect(() => {
    if (lastLanguage.current === language) return;
    lastLanguage.current = language;
    runForecast.mutate({ ...(runForecast.variables ?? toForecastRequest(params)), language });
  }, [language, params, runForecast]);

  return (
    <div className="mx-auto max-w-[1760px]">
      <ForecastControls
        params={params}
        onParamsChange={updateParams}
        onRun={handleRun}
        isRunning={isRunning}
        topRight={<Header />}
      />

      {/* ≥1680px: the reference layout (6·3·3 / 5·4·3). Laptops: two columns, decorative card hidden. */}
      <div className="mt-5 grid gap-4 md:grid-cols-2 3xl:grid-cols-12">
        <Reveal className="md:col-span-2 3xl:col-span-6" delay={0.2}>
          <PowerForecastChart forecast={forecast} isLoading={isRunning} />
        </Reveal>
        <Reveal className="3xl:col-span-3" delay={0.26}>
          <AgentActivity
            forecast={forecast}
            isRunning={isRunning}
            error={hasCurrentLanguage ? runForecast.error : null}
          />
        </Reveal>
        <Reveal className="3xl:col-span-3" delay={0.3}>
          <Card className="h-full space-y-6">
            <ForecastSummary forecast={forecast} isLoading={isRunning} />
            <ModelMetrics />
          </Card>
        </Reveal>

        <Reveal className="3xl:col-span-5" delay={0.34}>
          <WeatherPanel forecast={forecast} isLoading={isRunning} />
        </Reveal>
        <Reveal className="3xl:col-span-4" delay={0.4}>
          <AiExplanation forecast={forecast} isLoading={isRunning} />
        </Reveal>
        <Reveal className="hidden 3xl:col-span-3 3xl:block" delay={0.46}>
          <BrandCard />
        </Reveal>
      </div>
    </div>
  );
}
