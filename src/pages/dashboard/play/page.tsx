import { ICard } from "src/types/card";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Empty, Flex, Progress, Space, Spin, theme, Typography } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useBoolean } from "src/hooks/use-boolean";
import { GoThumbsdown, GoThumbsup } from "react-icons/go";
import { LuMoveLeft, LuPencil } from "react-icons/lu";
import AddEditCardModal from "src/components/dashboard/add-edit-card-modal";
import { useSettingsContext } from "src/settings/hooks";
import { IBox } from "src/types/box";
import get from "lodash.get";
import { HiSpeakerWave } from "react-icons/hi2";
import { removeParentheses } from "src/auth/context/utils";
import useChangeableSpeech from "src/hooks/use-speach";
import { FlipCardStyled } from "./styled";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { BiShowAlt } from "react-icons/bi";
import Confetti from "react-confetti";
import useConfetti from "src/hooks/use-confetti";
import { paths } from "src/routes/paths";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import finishImage from "src/assets/vectors/finished.png";
import ICategory from "src/types/category";

const PlayPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { theme: clientTheme } = useSettingsContext();
  const speacher = useChangeableSpeech();
  const params = useParams();
  const categoryId = params.categoryId as string;
  const isAll = categoryId === "ALL";
  const playedCount = useRef({ played: 0, count: 1 });

  const speachButtonRef = useRef<HTMLButtonElement>(null);
  const icBottonRef = useRef<HTMLButtonElement>(null);
  const cBottonRef = useRef<HTMLButtonElement>(null);

  const [activeCard, setActiveCard] = useState<ICard>();
  const showBool = useBoolean();
  const reverceRenderBool = useBoolean();
  const editModalBool = useBoolean();
  const { startConfetti, isPlaying } = useConfetti();

  const { data: active_cards_data, isLoading, isError } = useQuery({ queryKey: ["active-cards", categoryId], queryFn: () => axiosInstance.get(endpoints.card.getActive(categoryId)) });
  const { data: boxesData, isError: isErrorInBoxes } = useQuery({ queryKey: ["boxes", categoryId], queryFn: () => axiosInstance.get(endpoints.box.list(categoryId)), enabled: !isLoading && !isError && !isAll });
  const { data: categoriesData } = useQuery({ queryKey: ["categories"], queryFn: () => axiosInstance.get(endpoints.category.list) });

  const active_cards: ICard[] = active_cards_data?.data || [];
  const infoObject = makeInfoObject(isAll ? categoriesData?.data : boxesData?.data);

  const playCard = useCallback(
    (isCorrect: boolean, cId?: string) => {
      try {
        axiosInstance.post(endpoints.card.play(cId || categoryId), { cardId: activeCard?._id, correct: isCorrect });
      } catch (error) {
        console.error(error);
      }

      queryClient.setQueryData(["active-cards", cId ? "ALL" : categoryId], (oldData: any) => {
        const changed_active_cards = [...oldData.data];

        if (isCorrect) {
          if (playedCount.current.count === 1) playedCount.current.count = changed_active_cards.length || 1;
          playedCount.current.played++;
          changed_active_cards.shift();
        } else {
          const playedCard = changed_active_cards.shift();
          changed_active_cards.push(playedCard);
        }

        if (changed_active_cards.length) {
          const newActiveCard = changed_active_cards[0];
          setActiveCard(newActiveCard);
          speacher.setText(removeParentheses(newActiveCard?.front));
        } else {
          startConfetti();
        }
        showBool.onFalse();
        return { ...oldData, data: changed_active_cards };
      });
    },
    [activeCard, queryClient]
  );

  const clickEditButton = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    editModalBool.onTrue(activeCard);
  };

  const toggleReverce = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    reverceRenderBool.onToggle();
  };

  const handleSpeach = (e: any) => {
    e.stopPropagation();
    speacher.start();
  };

  const { token } = theme.useToken();
  const style = { background: token.colorBgContainer };

  useEffect(() => {
    if (isError || isErrorInBoxes) {
      localStorage.setItem("lastpath", paths.dashboard.analytics);
      navigate(paths.dashboard.analytics);
    }
  }, [isError, isErrorInBoxes]);

  useEffect(() => {
    if (active_cards.length > 0) {
      setActiveCard(active_cards[0]);
      speacher.setText(removeParentheses(active_cards[0]?.front));
    }
  }, [active_cards_data]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (editModalBool.value) return;
      if (e.key === "ArrowLeft" && icBottonRef.current) {
        e.preventDefault();
        icBottonRef.current.click();
      } else if (e.key === "ArrowRight" && cBottonRef.current) {
        e.preventDefault();
        cBottonRef.current.click();
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        showBool.onToggle();
      } else if ((e.key === "/" || e.key === "v" || e.key === "s") && speachButtonRef.current) {
        speachButtonRef.current.click();
      }
    };

    if (window) {
      window.addEventListener("keydown", keydown);
    }
    return () => {
      if (window) {
        window.removeEventListener("keydown", keydown);
      }
    };
  }, [editModalBool.value]);

  useEffect(() => {
    playedCount.current = { played: 0, count: 1 };
  }, [categoryId]);

  const absoluteActions = (
    <div className="edit-button">
      <Typography.Text className="text-sm" type="secondary">
        {isAll ? (
          get(infoObject, `[${activeCard?.categoryId}].title`)
        ) : (
          <>
            {t("Level")}: {get(infoObject, `[${activeCard?.boxId}].level`)}
          </>
        )}
      </Typography.Text>
      <Space>
        <Button size="small" onClick={clickEditButton} type="dashed" icon={<LuPencil />} />
        <Button size="small" onClick={toggleReverce} type={reverceRenderBool.value ? "primary" : "dashed"} icon={<LiaExchangeAltSolid />} />
      </Space>
    </div>
  );

  const cardelements = <>{activeCard && <Button ref={speachButtonRef} className="play-button" onClick={handleSpeach} type="dashed" icon={<HiSpeakerWave />} />}</>;

  return (
    <>
      <FlipCardStyled style={{ background: clientTheme === "dark" ? token.colorBgBase : "#e9ece5" }}>
        {isLoading ? (
          <div className="h-[300px] grid place-items-center">
            <Spin />
          </div>
        ) : active_cards.length <= 0 ? (
          <Empty
            description={
              <div className="flex flex-col items-center">
                <Typography.Text type="secondary">{t("you-have-completed-all-active-cards")}</Typography.Text>
                <Button href={isAll ? paths.dashboard.analytics : paths.dashboard.main(categoryId)} icon={<LuMoveLeft />} type="link">
                  {t("back-to-home")}
                </Button>
              </div>
            }
            image={finishImage}
            imageStyle={{ height: "300px", display: "flex", justifyContent: "center" }}
            rootClassName="mt-2"
          />
        ) : (
          <>
            <Progress strokeWidth={15} strokeColor={token.colorSuccess} className="progress" percent={(playedCount.current.played / playedCount.current.count) * 100} status="active" showInfo={false} />

            <div className="card cursor-pointer mx-auto">
              {absoluteActions}
              <div onClick={showBool.onToggle} style={style} key={activeCard?._id} className={`card-content shadow-md ${showBool.value ? "show" : ""}`}>
                <div className="card-front">
                  {cardelements}
                  <Typography.Title level={5}>{reverceRenderBool.value ? activeCard?.back : activeCard?.front}</Typography.Title>
                </div>

                <div className="card-back">
                  {cardelements}
                  <Typography.Title level={5}>{reverceRenderBool.value ? activeCard?.front : activeCard?.back}</Typography.Title>
                </div>
              </div>
            </div>

            <Flex gap="15px" className="actions" wrap>
              {showBool.value ? (
                <>
                  <Button className="flex-1" key={showBool.value ? "hide" : "show"} ref={icBottonRef} onClick={() => playCard(false, isAll ? activeCard?.categoryId : "")} danger size="large" icon={<GoThumbsdown />} />
                  <Button className="flex-1" key={showBool.value ? "hide" : "show"} ref={cBottonRef} onClick={() => playCard(true, isAll ? activeCard?.categoryId : "")} size="large" icon={<GoThumbsup />} />
                </>
              ) : (
                <Button className="flex-1" onClick={showBool.onTrue} type="primary" size="large" icon={<BiShowAlt />}>
                  {t("show-answer")}
                </Button>
              )}
            </Flex>
          </>
        )}
        <AddEditCardModal categoryId={categoryId} openBool={editModalBool} t={t} inPlayPage />
      </FlipCardStyled>
      {isPlaying && <Confetti />}
    </>
  );
};

const makeInfoObject = (list: IBox[] | ICategory[] = []) => {
  const obj: any = {};
  list.forEach((item, index) => {
    obj[item._id] = { ...item, level: index + 1 };
  });

  return obj;
};

export default PlayPage;
