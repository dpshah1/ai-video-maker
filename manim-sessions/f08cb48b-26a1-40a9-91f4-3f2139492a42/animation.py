from manim import *

class ErrorCorrectionScene(Scene):
    def construct(self):

        title = Text("From Lost Packets to Corrupted Data: The Magic of Error Correction", font_size=36)
        title.to_edge(UP)

        problem_text = Text("Imagine sending data to a satellite.", font_size=24)
        problem_text.next_to(title, DOWN, buff=0.5)

        satellite = Circle(radius=0.5).set_color(BLUE).move_to(LEFT * 3)
        packet1 = Square(side_length=1).set_color(GREEN).move_to(LEFT * 2 + UP)
        packet2 = Square(side_length=1).set_color(GREEN).move_to(LEFT * 2 + DOWN)
        lost_packet = Square(side_length=1).set_color(RED).move_to(LEFT * 2 + DOWN * 2)

        self.play(Write(title), Write(problem_text), Create(satellite), Create(packet1), Create(packet2))
        self.wait(1)
        self.play(FadeOut(packet2), FadeOut(packet1), FadeOut(satellite), FadeOut(problem_text))

        erasure_text = Text("A simple solution: send extra copies!", font_size=24)
        erasure_text.to_edge(UP)

        original_message = MathTex("x").move_to(LEFT * 3)
        lost_packets = MathTex("x").next_to(original_message, DOWN, buff=0.5)
        total_packets = MathTex("x").next_to(lost_packets, DOWN, buff=0.5)

        self.play(Write(erasure_text), Write(original_message), Write(lost_packets), Write(total_packets))
        self.wait(2)
        self.play(FadeOut(erasure_text), FadeOut(original_message), FadeOut(lost_packets), FadeOut(total_packets))

        poly_intro = Text("Remember polynomial interpolation?", font_size=24)
        poly_intro.to_edge(UP)

        points = VGroup(*[Dot(point=RIGHT * i + UP * (i % 2), color=YELLOW) for i in range(1, 6)])
        for point in points:
            point.scale(1.5)

        unique_poly = MathTex("P(x) \\text{ is unique of degree } n-1").next_to(points, DOWN, buff=0.5)

        self.play(Write(poly_intro), Create(points))
        self.wait(1)
        self.play(Write(unique_poly))
        self.wait(2)
        self.play(FadeOut(poly_intro), FadeOut(points), FadeOut(unique_poly))

        reimagined_text = Text("Let's think of our data packets as values of a polynomial.", font_size=24)
        reimagined_text.to_edge(UP)

        polynomial = MathTex("P(x) = a_0 + a_1 x + a_2 x^2 + \\ldots + a_{n-1} x^{n-1}").move_to(ORIGIN)
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(2)
        self.play(FadeOut(reimagined_text), FadeOut(polynomial))

        harder_problem_text = Text("What if packets are corrupted instead?", font_size=24)
        harder_problem_text.to_edge(UP)

        corrupted_packets = VGroup(*[Square(side_length=1).set_color(RED).move_to(LEFT * 2 + DOWN * i) for i in range(1, 4)])
        for packet in corrupted_packets:
            packet.set_fill(RED, opacity=0.5)

        self.play(Write(harder_problem_text), Create(corrupted_packets))
        self.wait(2)
        self.play(FadeOut(harder_problem_text), *[FadeOut(packet) for packet in corrupted_packets])

        reed_solomon_text = Text("Reed-Solomon code comes to the rescue!", font_size=24)
        reed_solomon_text.to_edge(UP)

        error_locator_poly = MathTex("E(x) = (x - r_1)(x - r_2) \\ldots (x - r_k)").move_to(ORIGIN)
        received_data = MathTex("Q(x) = P(x)E(x)").next_to(error_locator_poly, DOWN, buff=0.5)

        self.play(Write(reed_solomon_text), Write(error_locator_poly))
        self.wait(1)
        self.play(Write(received_data))
        self.wait(2)
        self.play(FadeOut(reed_solomon_text), FadeOut(error_locator_poly), FadeOut(received_data))

        berlekamp_text = Text("The Berlekamp-Welsh algorithm uses linear equations.", font_size=24)
        berlekamp_text.to_edge(UP)

        linear_eq = MathTex("Q(i) = r_i E(i) \\text{ for } i=1, 2, \\ldots, n + 2k").move_to(ORIGIN)
        solve_eq = MathTex("x").next_to(linear_eq, DOWN, buff=0.5)

        self.play(Write(berlekamp_text), Write(linear_eq))
        self.wait(1)
        self.play(Write(solve_eq))
        self.wait(2)
        self.play(FadeOut(berlekamp_text), FadeOut(linear_eq), FadeOut(solve_eq))

        summary_text = Text("Error correcting codes ensure reliable communication.", font_size=24)
        summary_text.to_edge(UP)

        applications = Text("Applications: Satellite communication, Data storage, QR codes", font_size=20).next_to(summary_text, DOWN, buff=0.5)

        self.play(Write(summary_text), Write(applications))
        self.wait(2)

        self.play(FadeOut(summary_text), FadeOut(applications))