import React, { useState } from "react";
import { Form, InputGroup, Button, Card } from "react-bootstrap";
import { useFetchCoreQuery } from "../../store/services/bar";
import { config } from "../../config";

export interface EnableFormProps {
  enableDiscount: (categories: string[], discount: number) => void;
  loading: boolean;
}

export const EnableDiscountForm = ({
  enableDiscount,
  loading,
}: EnableFormProps) => {
  const {
    data,
    isLoading,
    isFetching,
    refetch: refetchCore,
  } = useFetchCoreQuery();
  const [discountPercent, setDiscountPercent] = useState(
    config.clubDiscount.discount
  );
  const [selectedCategories, setSelectedCategories] = useState(
    data?.categories.reduce((prev, c) => {
      prev[c.id] = config.clubDiscount.categoryNames.includes(c.name);
      return prev;
    }, {} as { [key: string]: boolean }) || {}
  );

  const discount = data?.discount?.length === 1 ? data?.discount[0] : undefined;
  const categories = data?.categories;

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && !discount && categories && (
        <>
          <Card>
            <Card.Body>
              <h6>Add discount</h6>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Categories</Form.Label>
                  {categories.map((category) => (
                    <Form.Check
                      type="checkbox"
                      key={category.id}
                      id={`category-${category.id}`}
                      value={category.id}
                      label={category.name}
                      checked={selectedCategories[category.id]}
                      onChange={(e) => {
                        const newSelectedCategories = { ...selectedCategories };
                        newSelectedCategories[category.id] = e.target.checked;
                        setSelectedCategories(newSelectedCategories);
                      }}
                    />
                  ))}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPercent">
                  <Form.Label>Discount</Form.Label>
                  <InputGroup className="mb-2">
                    <Form.Control
                      type="number"
                      placeholder="Enter % discount"
                      value={discountPercent}
                      onChange={(e) =>
                        setDiscountPercent(parseInt(e.target.value))
                      }
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Button
                  variant="success"
                  disabled={loading}
                  onClick={() =>
                    enableDiscount(
                      Object.keys(selectedCategories).filter(
                        (k) => selectedCategories[k]
                      ),
                      discountPercent
                    )
                  }
                >
                  Enable club discount
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};
