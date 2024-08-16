import React, { useEffect } from "react";
import { Button, Form, Input, Row, Col, Card, Image, message, Typography } from "antd";
import { useAuthContext } from "src/auth/hooks";
import get from "lodash.get";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { LinkOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { UpdateProfileDto } from "src/types/user";

const Profile: React.FC = () => {
  const { user, reinitialize } = useAuthContext();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { mutate: updateProfile, isPending } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: (data: UpdateProfileDto) => axiosInstance.patch(endpoints.user.update, data),
    onSuccess: () => {
      reinitialize();
      message.success(t("successfully_updated"));
    },
    onError: () => "",
  });

  const redirectToTelegram = () => {
    if (!user?._id) return;
    const url = `https://t.me/flashcardes_bot?start=${btoa(user?._id)}`;
    window.open(url, "_blank");
  };

  const handleFinish = (values: UpdateProfileDto) => {
    updateProfile({ firstName: values.firstName, lastName: values.lastName });
  };

  useEffect(() => {
    form.setFieldsValue({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    });
  }, [form, user]);

  return (
    <div style={{ padding: "20px" }}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} md={24} lg={8}>
            <Card className="h-full " classNames={{ body: "h-full flex justify-center items-center" }}>
              <Image wrapperClassName="w-full h-auto max-w-4 max-h-52 max-w-52 rounded-full overflow-hidden" src={get(user, "picture")} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={24} lg={16}>
            <Card>
              <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Please input your first name!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Please input your last name!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input readOnly />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-between w-full">
                  <Button icon={<LinkOutlined />} type="dashed" onClick={redirectToTelegram}>
                    {t("connect-telegram-accaunt")}
                  </Button>
                  <Button loading={isPending} type="primary" htmlType="submit">
                    {t("save")}
                  </Button>
                </div>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>

      <Card className="mt-5">
        <Typography.Title level={5}>{t("telegram-accaunts")}</Typography.Title>
      </Card>
    </div>
  );
};

export default Profile;
